import os

# Base paths
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)

# ML model settings
# The best.pt model folder is in the models subdirectory
MODEL_PATH = os.path.join(BASE_DIR, "models", "best_model.pt")

# Upload and static file locations
UPLOAD_FOLDER = os.path.join(BASE_DIR, "static", "uploads")
ALLOWED_EXTENSIONS = {"png", "jpg", "jpeg"}

# Create upload folder if not exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Detection settings
YOLO_CONF_THRESHOLD = 0.15
OCR_CONF_THRESHOLD = 0.50
HELMET_CONF_THRESHOLD = 0.15

# Advanced filtering settings
RIDER_CONF_THRESHOLD = 0.25
MIN_RIDER_HEIGHT = 40       # Minimum height in pixels
MIN_RIDER_WIDTH = 20         # Minimum width in pixels
PLATE_MIN_LEN = 4            # Minimum license plate characters
PLATE_CONF_THRESHOLD = 0.35  # Minimum plate box confidence

# Aspect ratio limits (Height / Width)
MIN_RIDER_ASPECT_RATIO = 0.65  # Avoid wide parked bikes
MAX_RIDER_ASPECT_RATIO = 2.2  # Avoid narrow standing pedestrians


# Severity settings
SEVERITY_MAPPING = {
    "Helmet Non-Compliance": "High",
    "Seatbelt Non-Compliance": "Medium",
    "Triple Riding": "High",
    "Wrong-Side Driving": "High",
    "Illegal Parking": "Medium"
}
