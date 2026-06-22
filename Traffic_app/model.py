import os
import cv2
import numpy as np
import re
from ultralytics import YOLO
import config

_yolo_model = None
_ocr_reader = None
_coco_model = None

def _load_yolo_model():
    """Loads YOLOv8 model once and caches it."""
    global _yolo_model
    if _yolo_model is None:
        # Load the model from MODEL_PATH config
        # Note: If it's a folder, Ultralytics can still load it
        _yolo_model = YOLO(config.MODEL_PATH)
    return _yolo_model

def _load_ocr_reader():
    """Loads EasyOCR reader once and caches it."""
    global _ocr_reader
    if _ocr_reader is None:
        import easyocr
        # Initialize EasyOCR reader for English language on CPU (gpu=False)
        _ocr_reader = easyocr.Reader(['en'], gpu=False)
    return _ocr_reader

def _load_coco_model():
    """Loads the pre-trained COCO model for person detection."""
    global _coco_model
    if _coco_model is None:
        coco_path = os.path.join(os.path.dirname(config.MODEL_PATH), "yolov8n.pt")
        _coco_model = YOLO(coco_path)
    return _coco_model

def has_overlapping_person(rider_box, person_boxes):
    """
    Checks if a detected motorcyclist has an overlapping person detection.
    Helps filter out parked/empty motorcycles.
    """
    if not person_boxes:
        return False
        
    rx1, ry1, rx2, ry2 = rider_box
    
    for pbox in person_boxes:
        px1, py1, px2, py2 = pbox
        # Calculate intersection
        ix1 = max(rx1, px1)
        iy1 = max(ry1, py1)
        ix2 = min(rx2, px2)
        iy2 = min(ry2, py2)
        
        inter_w = max(0, ix2 - ix1)
        inter_area = inter_w * max(0, iy2 - iy1)
        
        pbox_area = (px2 - px1) * (py2 - py1)
        if pbox_area <= 0:
            continue
            
        # Check how much of the person box overlaps the motorcyclist box
        overlap_ratio = inter_area / pbox_area
        if overlap_ratio >= 0.40:
            return True
            
    return False

def has_overlapping_object(box, candidate_boxes, min_overlap=0.25):
    """
    Checks if 'box' has a significant overlap with any box in 'candidate_boxes'.
    Uses intersection over the minimum of the two boxes to be robust.
    """
    if not candidate_boxes:
        return False
        
    x1, y1, x2, y2 = box
    box_area = (x2 - x1) * (y2 - y1)
    if box_area <= 0:
        return False
        
    for cbox in candidate_boxes:
        cx1, cy1, cx2, cy2 = cbox
        ix1 = max(x1, cx1)
        iy1 = max(y1, cy1)
        ix2 = min(x2, cx2)
        iy2 = min(y2, cy2)
        
        inter_w = max(0, ix2 - ix1)
        inter_h = max(0, iy2 - iy1)
        inter_area = inter_w * inter_h
        
        cbox_area = (cx2 - cx1) * (cy2 - cy1)
        if cbox_area <= 0:
            continue
            
        min_candidate_area = min(box_area, cbox_area)
        overlap_ratio = inter_area / min_candidate_area
        if overlap_ratio >= min_overlap:
            return True
            
    return False

def helmet_overlaps_head(h_box, head_zone, min_overlap=0.40):
    """
    Checks if a detected helmet overlaps the rider's head zone.
    Uses intersection over helmet area to be robust against large head zones.
    """
    hx1, hy1, hx2, hy2 = h_box
    h_area = (hx2 - hx1) * (hy2 - hy1)
    if h_area <= 0:
        return False
        
    hzx1, hzy1, hzx2, hzy2 = head_zone
    
    # Calculate intersection
    ix1 = max(hx1, hzx1)
    iy1 = max(hy1, hzy1)
    ix2 = min(hx2, hzx2)
    iy2 = min(hy2, hzy2)
    
    inter_w = max(0, ix2 - ix1)
    inter_h = max(0, iy2 - iy1)
    inter_area = inter_w * inter_h
    
    # Check how much of the helmet is inside the head zone
    overlap = inter_area / h_area
    return overlap >= min_overlap

def iou(box1, box2):
    """
    Intersection over Union between two bounding boxes.
    Each box is (x1, y1, x2, y2)
    """
    x1 = max(box1[0], box2[0])
    y1 = max(box1[1], box2[1])
    x2 = min(box1[2], box2[2])
    y2 = min(box1[3], box2[3])

    inter_area = max(0, x2 - x1) * max(0, y2 - y1)

    box1_area = (box1[2] - box1[0]) * (box1[3] - box1[1])
    box2_area = (box2[2] - box2[0]) * (box2[3] - box2[1])

    union_area = box1_area + box2_area - inter_area
    return inter_area / union_area if union_area > 0 else 0

def clean_plate_text(text):
    """Cleans extracted OCR text to match standard license plates."""
    # Convert to uppercase and keep alphanumeric characters only
    clean = re.sub(r'[^A-Z0-9]', '', text.upper())
    return clean

def find_nearest_plate(rider_box, plates):
    """
    Finds the nearest license plate to a given rider box based on center distance.
    """
    if not plates:
        return None
        
    rx1, ry1, rx2, ry2 = rider_box
    rcx = (rx1 + rx2) / 2.0
    rcy = (ry1 + ry2) / 2.0
    rw = rx2 - rx1
    rh = ry2 - ry1
    
    best_plate = None
    min_dist = float('inf')
    
    for p in plates:
        px1, py1, px2, py2 = p["box"]
        pcx = (px1 + px2) / 2.0
        pcy = (py1 + py2) / 2.0
        
        # 1. The license plate center must be in the lower portion of the rider's bounding box
        # (License plates are near the rear/front wheel, so they should be below the upper 50% of the height)
        if pcy < (ry1 + rh * 0.50):
            continue
            
        # 2. Proximity threshold: check horizontal and vertical limits to prevent
        # adjacent vehicle plates from associating with this rider box.
        # Plate must be horizontally within 35% of rider width, and vertically within 60% of rider height.
        if abs(rcx - pcx) > (rw * 0.35) or abs(rcy - pcy) > (rh * 0.6):
            continue
            
        # Euclidean distance between box centers
        dist = ((rcx - pcx) ** 2 + (rcy - pcy) ** 2) ** 0.5
        
        if dist < min_dist:
            min_dist = dist
            best_plate = p
            
    # Proximity threshold: plate center must be within maximum allowed distance.
    max_allowed_dist = max(rw * 1.2, rh * 1.0)
    if min_dist <= max_allowed_dist:
        return best_plate
        
    return None

def run_inference(image_path, preprocessed_img=None):
    """
    Runs YOLOv8 object detection on the image (or preprocessed image),
    computes helmet violations, and runs OCR on detected license plates.
    """
    model = _load_yolo_model()
    coco_model = _load_coco_model()
    
    # We can pass preprocessed_img if available, otherwise path
    input_source = preprocessed_img if preprocessed_img is not None else image_path
    
    # Read original image to calculate scale factors and crop plates
    orig_img = cv2.imread(image_path)
    if orig_img is None:
        raise ValueError(f"Could not read image at {image_path}")
    orig_h, orig_w = orig_img.shape[:2]
    
    # Calculate scale factor to map coordinates back if dimensions differ
    if preprocessed_img is not None:
        prep_h, prep_w = preprocessed_img.shape[:2]
        scale_x = orig_w / prep_w
        scale_y = orig_h / prep_h
    else:
        scale_x = 1.0
        scale_y = 1.0
        
    # Run YOLOv8 detection
    results = model(input_source, conf=config.YOLO_CONF_THRESHOLD)
    result = results[0]
    class_names = model.names
    
    # Run COCO model for person & motorcycle detection at a higher conf (0.35) for validation
    coco_results = coco_model(input_source, conf=0.35)
    coco_result = coco_results[0]
    
    person_boxes = []
    motorcycle_boxes = []
    bicycle_boxes = []
    for b in coco_result.boxes:
        cls_idx = int(b.cls)
        cls_name = coco_model.names[cls_idx]
        if cls_name == "person":
            person_boxes.append(b.xyxy[0].tolist())
        elif cls_name == "motorcycle":
            motorcycle_boxes.append(b.xyxy[0].tolist())
        elif cls_name == "bicycle":
            bicycle_boxes.append(b.xyxy[0].tolist())
            
    boxes = result.boxes
    
    # Identify classes in detections case-insensitively (Pass 1)
    raw_motorcyclists = []
    helmets = []
    license_plates = []
    
    for b in boxes:
        cls_idx = int(b.cls)
        cls_name = class_names[cls_idx].lower()
        box_coords = b.xyxy[0].tolist()  # [x1, y1, x2, y2]
        conf = float(b.conf)
        
        det_obj = {
            "box": box_coords,
            "confidence": conf
        }
        
        if "motorcyclist" in cls_name or "rider" in cls_name or "person" in cls_name:
            rider_conf_thresh = getattr(config, 'RIDER_CONF_THRESHOLD', 0.25)
            if conf >= rider_conf_thresh:
                raw_motorcyclists.append(det_obj)
        elif "helmet" in cls_name:
            helmet_conf_thresh = getattr(config, 'HELMET_CONF_THRESHOLD', 0.15)
            if conf >= helmet_conf_thresh:
                helmets.append(det_obj)
        elif "plate" in cls_name or "license" in cls_name:
            # Apply confidence threshold check for license plate detections
            plate_conf_thresh = getattr(config, 'PLATE_CONF_THRESHOLD', 0.35)
            if conf >= plate_conf_thresh:
                license_plates.append(det_obj)
                
    # Double-validation filtering for motorcyclists (Pass 2)
    motorcyclists = []
    plate_boxes = [p["box"] for p in license_plates]
    
    for m in raw_motorcyclists:
        box_coords = m["box"]
        conf = m["confidence"]
        
        width = box_coords[2] - box_coords[0]
        height = box_coords[3] - box_coords[1]
        
        if width > 0:
            aspect_ratio = height / width
            min_ratio = getattr(config, 'MIN_RIDER_ASPECT_RATIO', 1.0)
            max_ratio = getattr(config, 'MAX_RIDER_ASPECT_RATIO', 2.2)
            
            # Filter out standing pedestrians (too narrow) and parked motorcycles (too wide)
            if aspect_ratio >= min_ratio and aspect_ratio <= max_ratio:
                rider_conf_thresh = getattr(config, 'RIDER_CONF_THRESHOLD', 0.50)
                min_height = getattr(config, 'MIN_RIDER_HEIGHT', 180)
                min_width = getattr(config, 'MIN_RIDER_WIDTH', 80)
                
                if conf >= rider_conf_thresh:
                    if height >= min_height and width >= min_width:
                        # Skip if this rider heavily overlaps with a COCO detected bicycle (to filter out bicyclists)
                        if has_overlapping_object(box_coords, bicycle_boxes, min_overlap=0.30):
                            continue
                            
                        # 1. Must overlap with a person
                        if has_overlapping_person(box_coords, person_boxes):
                            # 2. Must also overlap with a motorcycle OR a license plate
                            if (has_overlapping_object(box_coords, motorcycle_boxes, min_overlap=0.25) or 
                                    has_overlapping_object(box_coords, plate_boxes, min_overlap=0.25)):
                                motorcyclists.append(m)

    # 2. Run OCR on detected license plates
    detected_plates_data = []
    
    ocr_reader = None
    if len(license_plates) > 0:
        try:
            ocr_reader = _load_ocr_reader()
        except Exception as e:
            print("Failed to initialize EasyOCR. Proceeding without OCR:", e)

    for idx, p in enumerate(license_plates):
        px1, py1, px2, py2 = map(int, p["box"])
        
        # Map to original coordinate space for cropping from orig_img
        px1 = int(px1 * scale_x)
        py1 = int(py1 * scale_y)
        px2 = int(px2 * scale_x)
        py2 = int(py2 * scale_y)
        
        # Clip coordinates to image boundaries
        px1 = max(0, px1)
        py1 = max(0, py1)
        px2 = min(orig_img.shape[1], px2)
        py2 = min(orig_img.shape[0], py2)
        
        plate_text = "UNKNOWN"
        ocr_conf = 0.0
        
        if ocr_reader is not None and (px2 > px1) and (py2 > py1):
            # Expand the crop box to recover shifted bounding boxes (like mudguard detections)
            w_crop = px2 - px1
            h_crop = py2 - py1
            
            exp_py1 = max(0, int(py1 - h_crop * 0.45))
            exp_py2 = min(orig_img.shape[0], int(py2 + h_crop * 0.10))
            exp_px1 = max(0, int(px1 - w_crop * 0.15))
            exp_px2 = min(orig_img.shape[1], int(px2 + w_crop * 0.15))
            
            # Crop using expanded coordinates
            plate_crop = orig_img[exp_py1:exp_py2, exp_px1:exp_px2]
            
            # Upscale crop and apply advanced image sharpening to improve OCR accuracy
            h_crop, w_crop = plate_crop.shape[:2]
            if w_crop > 0 and h_crop > 0:
                scale_factor = max(3.0, 200.0 / w_crop, 60.0 / h_crop)
                new_w = int(w_crop * scale_factor)
                new_h = int(h_crop * scale_factor)
                
                # Grayscale conversion
                gray = cv2.cvtColor(plate_crop, cv2.COLOR_BGR2GRAY)
                # Resize
                gray_resized = cv2.resize(gray, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
                # Denoise
                blurred = cv2.GaussianBlur(gray_resized, (0, 0), 2)
                # Unsharp Masking
                sharpened = cv2.addWeighted(gray_resized, 2.0, blurred, -1.0, 0)
                plate_crop = sharpened
            
            # Run OCR
            try:
                ocr_results = ocr_reader.readtext(plate_crop)
                if len(ocr_results) > 0:
                    # Pick result with highest confidence
                    ocr_results_sorted = sorted(ocr_results, key=lambda x: x[2], reverse=True)
                    raw_text, ocr_conf = ocr_results_sorted[0][1], float(ocr_results_sorted[0][2])
                    cleaned = clean_plate_text(raw_text)
                    plate_min_len = getattr(config, 'PLATE_MIN_LEN', 5)
                    # Relaxed confidence requirement for low-resolution/difficult plates slightly to 0.50
                    if len(cleaned) >= plate_min_len and ocr_conf >= 0.50:
                        plate_text = cleaned
                    else:
                        plate_text = "UNKNOWN"
                        ocr_conf = 0.0
            except Exception as ocr_err:
                print(f"OCR Error on plate_{idx+1}:", ocr_err)
                
        # Scale the plate box back to original coordinates for reporting/annotation
        scaled_box = [
            p["box"][0] * scale_x,
            p["box"][1] * scale_y,
            p["box"][2] * scale_x,
            p["box"][3] * scale_y
        ]
        detected_plates_data.append({
            "id": f"plate_{idx+1}",
            "box": scaled_box,
            "confidence": p["confidence"],
            "text": plate_text,
            "ocr_confidence": ocr_conf
        })

    # Scale the helmets back to original coordinates
    scaled_helmets = []
    for h in helmets:
        scaled_box = [
            h["box"][0] * scale_x,
            h["box"][1] * scale_y,
            h["box"][2] * scale_x,
            h["box"][3] * scale_y
        ]
        scaled_helmets.append({
            "box": scaled_box,
            "confidence": h["confidence"]
        })

    # 3. Evaluate helmet violations for each motorcyclist & associate plates
    violations = []
    detected_motorcyclists_data = []
    
    # Associate each helmet with the single closest rider whose head zone it overlaps.
    # A helmet cannot be shared by multiple riders.
    rider_has_helmet = [False] * len(motorcyclists)
    for h in helmets:
        hx1, hy1, hx2, hy2 = h["box"]
        hcx = (hx1 + hx2) / 2.0
        
        best_rider_idx = None
        min_dist = float('inf')
        
        for idx, m in enumerate(motorcyclists):
            mx1, my1, mx2, my2 = m["box"]
            head_zone = (mx1, my1, mx2, my1 + (my2 - my1) * 0.35)
            
            if helmet_overlaps_head(h["box"], head_zone, min_overlap=0.30):
                rcx = (mx1 + mx2) / 2.0
                dist = abs(hcx - rcx)
                if dist < min_dist:
                    min_dist = dist
                    best_rider_idx = idx
                    
        if best_rider_idx is not None:
            rider_has_helmet[best_rider_idx] = True
            
    for idx, m in enumerate(motorcyclists):
        mx1, my1, mx2, my2 = m["box"]
        has_helmet = rider_has_helmet[idx]
        
        status = "Compliant" if has_helmet else "Violation Detected"
        
        # Scale the rider box back to original coordinates
        scaled_rider_box = [
            mx1 * scale_x,
            my1 * scale_y,
            mx2 * scale_x,
            my2 * scale_y
        ]
        
        # Find closest plate
        associated_plate = find_nearest_plate(scaled_rider_box, detected_plates_data)
        
        rider_info = {
            "id": f"rider_{idx+1}",
            "box": scaled_rider_box,
            "confidence": m["confidence"],
            "status": status,
            "plate_text": associated_plate["text"] if associated_plate else "UNKNOWN",
            "ocr_confidence": associated_plate["ocr_confidence"] if associated_plate else 0.0,
            "plate_box": associated_plate["box"] if associated_plate else None
        }
        detected_motorcyclists_data.append(rider_info)
        
        # Only log a violation if the rider is close enough to be reliably evaluated,
        # or if we successfully resolved their license plate.
        rh_orig = scaled_rider_box[3] - scaled_rider_box[1]
        is_reliable = (rh_orig >= 180) or (rider_info["plate_text"] != "UNKNOWN")
        
        if not has_helmet and is_reliable:
            violations.append({
                "type": "Helmet Non-Compliance",
                "confidence": m["confidence"],
                "box": scaled_rider_box,
                "severity": config.SEVERITY_MAPPING.get("Helmet Non-Compliance", "High"),
                "plate_text": rider_info["plate_text"],
                "ocr_confidence": rider_info["ocr_confidence"],
                "plate_box": rider_info["plate_box"]
            })

    return {
        "motorcyclists": detected_motorcyclists_data,
        "helmets": scaled_helmets,
        "plates": detected_plates_data,
        "violations": violations
    }
