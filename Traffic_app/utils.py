import cv2
import os
import numpy as np

def preprocess_image(image_path):
    """
    Applies preprocessing to enhance image details, especially for low-light,
    shadowy, or blurry traffic camera images.
    If the image is low-resolution, it is upscaled using Lanczos interpolation.
    """
    # Read the image
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Could not read image at {image_path}")
        
    # If the image resolution is low, upscale it using Lanczos interpolation
    h, w = img.shape[:2]
    target_w, target_h = 1280, 720
    if w < target_w or h < target_h:
        scale = max(target_w / w, target_h / h)
        new_w = int(round(w * scale))
        new_h = int(round(h * scale))
        img = cv2.resize(img, (new_w, new_h), interpolation=cv2.INTER_LANCZOS4)
        
    # Convert to YUV to apply CLAHE on luminance channel (preserves colors)
    img_yuv = cv2.cvtColor(img, cv2.COLOR_BGR2YUV)
    
    # Apply CLAHE (Contrast Limited Adaptive Histogram Equalization)
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8))
    img_yuv[:, :, 0] = clahe.apply(img_yuv[:, :, 0])
    
    # Convert back to BGR
    enhanced_img = cv2.cvtColor(img_yuv, cv2.COLOR_YUV2BGR)
    
    # Apply mild denoising (bilateral filter) to smooth out compression/sensor noise
    # while preserving edge details (crucial for license plates)
    denoised_img = cv2.bilateralFilter(enhanced_img, d=5, sigmaColor=50, sigmaSpace=50)
    
    return denoised_img

def annotate_image(image_path, motorcyclists, license_plates, helmets, violations, output_path):
    """
    Draws bounding boxes and labels for detections and violations.
    - Blue box: Motorcyclist / Rider
    - Green box: Helmet (or vehicle component)
    - Yellow box: License plate
    - Red box: Violator (e.g., motorcyclist with no helmet)
    """
    img = cv2.imread(image_path)
    if img is None:
        return
        
    # Define colors (BGR)
    color_rider = (255, 0, 0)      # Blue for compliant/detected rider
    color_helmet = (0, 255, 0)     # Green for helmet
    color_plate = (0, 255, 255)    # Yellow for license plate
    color_violation = (0, 0, 255)  # Red for violation
    
    drawn_regions = []
    
    def draw_text_avoiding_collision(text, x, preferred_y, alternative_y, color, scale, thickness):
        font = cv2.FONT_HERSHEY_SIMPLEX
        (w, h), baseline = cv2.getTextSize(text, font, scale, thickness)
        
        # Clamp preferred and alternative x/y within the image borders
        img_h, img_w = img.shape[:2]
        x = max(2, min(x, img_w - w - 2))
        preferred_y = max(h + 4, min(preferred_y, img_h - baseline - 2))
        alternative_y = max(h + 4, min(alternative_y, img_h - baseline - 2))
        
        tx1, ty1, tx2, ty2 = x - 2, preferred_y - h - 4, x + w + 2, preferred_y + baseline + 2
        
        overlap = False
        for (ax1, ay1, ax2, ay2) in drawn_regions:
            if not (tx2 < ax1 or tx1 > ax2 or ty2 < ay1 or ty1 > ay2):
                overlap = True
                break
                
        if overlap:
            tx1, ty1, tx2, ty2 = x - 2, alternative_y - h - 4, x + w + 2, alternative_y + baseline + 2
            overlap = False
            for (ax1, ay1, ax2, ay2) in drawn_regions:
                if not (tx2 < ax1 or tx1 > ax2 or ty2 < ay1 or ty1 > ay2):
                    overlap = True
                    break
            
            y = alternative_y
            if overlap:
                max_y = alternative_y
                for (ax1, ay1, ax2, ay2) in drawn_regions:
                    if not (tx2 < ax1 or tx1 > ax2):
                        max_y = max(max_y, ay2 + h + 6)
                y = min(max_y, img_h - baseline - 2)
        else:
            y = preferred_y
            
        # Draw background rectangle for readability
        cv2.rectangle(img, (x - 2, y - h - 4), (x + w + 2, y + baseline + 2), (0, 0, 0), -1)
        # Draw text
        cv2.putText(img, text, (x, y), font, scale, color, thickness, cv2.LINE_AA)
        
        # Save drawn region
        drawn_regions.append((x - 2, y - h - 4, x + w + 2, y + baseline + 2))
        
    # 1. Draw helmets
    for h in helmets:
        x1, y1, x2, y2 = map(int, h["box"])
        cv2.rectangle(img, (x1, y1), (x2, y2), color_helmet, 2)
        draw_text_avoiding_collision(
            text="Helmet",
            x=x1,
            preferred_y=y1 - 5,
            alternative_y=y2 + 15,
            color=color_helmet,
            scale=0.4,
            thickness=1
        )

    # 2. Draw plates
    for p in license_plates:
        x1, y1, x2, y2 = map(int, p["box"])
        cv2.rectangle(img, (x1, y1), (x2, y2), color_plate, 2)
        text = f"Plate: {p['text']}" if p['text'] else "Plate"
        draw_text_avoiding_collision(
            text=text,
            x=x1,
            preferred_y=y1 - 5,
            alternative_y=y2 + 15,
            color=color_plate,
            scale=0.4,
            thickness=1
        )

    # 3. Draw motorcyclists and check if they have violations
    for m in motorcyclists:
        x1, y1, x2, y2 = map(int, m["box"])
        
        is_violator = False
        violation_type = None
        for v in violations:
            vx1, vy1, vx2, vy2 = map(int, v["box"])
            if abs(x1 - vx1) < 10 and abs(y1 - vy1) < 10:
                is_violator = True
                violation_type = v["type"]
                break
                
        if is_violator:
            cv2.rectangle(img, (x1, y1), (x2, y2), color_violation, 3)
            draw_text_avoiding_collision(
                text=f"WARNING: {violation_type}",
                x=x1,
                preferred_y=y1 - 10,
                alternative_y=y2 + 20,
                color=color_violation,
                scale=0.5,
                thickness=2
            )
        else:
            cv2.rectangle(img, (x1, y1), (x2, y2), color_rider, 2)
            draw_text_avoiding_collision(
                text="Rider",
                x=x1,
                preferred_y=y1 - 5,
                alternative_y=y2 + 15,
                color=color_rider,
                scale=0.4,
                thickness=1
            )

    # Save output image
    cv2.imwrite(output_path, img)
