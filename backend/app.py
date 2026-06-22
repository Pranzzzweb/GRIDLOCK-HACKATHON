import os
import uuid
import datetime
import json

from flask import Flask, request, jsonify, render_template, send_from_directory
from flask_cors import CORS
from werkzeug.utils import secure_filename

import config
import utils
import model
import report

app = Flask(__name__, template_folder="templates", static_folder="static")
CORS(app)
app.config["UPLOAD_FOLDER"] = config.UPLOAD_FOLDER
app.config["MAX_CONTENT_LENGTH"] = 16 * 1024 * 1024  # 16MB max upload size

# Path to our local JSON "database"
DB_PATH = os.path.join(config.UPLOAD_FOLDER, "db.json")

def init_db():
    """Initializes the database file if it doesn't exist."""
    if not os.path.exists(DB_PATH):
        with open(DB_PATH, 'w') as f:
            json.dump([], f)

def read_db():
    """Reads all case history from the database."""
    init_db()
    try:
        with open(DB_PATH, 'r') as f:
            return json.load(f)
    except Exception:
        return []

def write_db(data):
    """Writes case history back to the database."""
    with open(DB_PATH, 'w') as f:
        json.dump(data, f, indent=4)

def allowed_file(filename):
    """Checks if the uploaded file has an allowed image extension."""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in config.ALLOWED_EXTENSIONS

@app.route("/")
def index():
    """Renders the main dashboard HTML template."""
    return render_template("index.html")

@app.route("/api/upload", methods=["POST"])
def upload_image():
    """
    Handles image uploads, runs preprocessing, model inference, OCR,
    generates visual annotations, compiles challan PDF, and updates statistics.
    """
    if "image" not in request.files:
        return jsonify({"error": "No image file provided"}), 400
        
    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400
        
    if not allowed_file(file.filename):
        return jsonify({"error": f"Invalid file extension. Allowed types: {config.ALLOWED_EXTENSIONS}"}), 400
        
    try:
        # 1. Save original uploaded file
        orig_filename = secure_filename(file.filename)
        unique_id = uuid.uuid4().hex[:12]
        ext = orig_filename.rsplit('.', 1)[1].lower()
        
        orig_save_name = f"orig_{unique_id}.{ext}"
        orig_save_path = os.path.join(app.config["UPLOAD_FOLDER"], orig_save_name)
        file.save(orig_save_path)
        
        # 2. Apply preprocessing
        # We can either pass the preprocessed image as ndarray to YOLO or write it back
        preprocessed_img = utils.preprocess_image(orig_save_path)
        
        # 3. Run YOLO detection and EasyOCR pipeline
        results = model.run_inference(orig_save_path, preprocessed_img=preprocessed_img)
        
        # 4. Generate annotated image
        annotated_name = f"annotated_{unique_id}.jpg"
        annotated_path = os.path.join(app.config["UPLOAD_FOLDER"], annotated_name)
        
        utils.annotate_image(
            image_path=orig_save_path,
            motorcyclists=results["motorcyclists"],
            license_plates=results["plates"],
            helmets=results["helmets"],
            violations=results["violations"],
            output_path=annotated_path
        )
        
        # 5. Extract license plate text & plate box for PDF crop
        detected_plate_text = "UNKNOWN"
        ocr_confidence = 0.0
        plate_box = None
        
        # Proximity-based license plate retrieval for violations
        if len(results["violations"]) > 0:
            # Check if any violation has a proximity-associated plate.
            # This protects compliant riders from false plate links.
            for v in results["violations"]:
                if v.get("plate_box") is not None:
                    detected_plate_text = v["plate_text"]
                    ocr_confidence = v["ocr_confidence"]
                    plate_box = v["plate_box"]
                    break
        else:
            # If the case is fully compliant, do not extract the best overall plate
            detected_plate_text = "N/A"
            ocr_confidence = 0.0
            plate_box = None

        # 6. Generate PDF challan if there are any violations
        challan_name = None
        challan_path = None
        timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
        challan_id = f"CH-{unique_id.upper()}"
        
        if len(results["violations"]) > 0:
            challan_name = f"challan_{unique_id}.pdf"
            challan_save_path = os.path.join(app.config["UPLOAD_FOLDER"], challan_name)
            
            # Prepare data payload for PDF generator
            challan_data = {
                "challan_id": challan_id,
                "timestamp": timestamp,
                "plate_text": detected_plate_text,
                "ocr_confidence": ocr_confidence,
                "violations": results["violations"],
                "image_path": orig_save_path,
                "annotated_image_path": annotated_path,
                "plate_box": plate_box
            }
            
            report.generate_challan_pdf(challan_data, challan_save_path)
            challan_path = f"/static/uploads/{challan_name}"

        # 7. Write case details to local JSON database
        case_data = {
            "id": unique_id,
            "challan_id": challan_id if len(results["violations"]) > 0 else "N/A",
            "timestamp": timestamp,
            "image_path": f"/static/uploads/{orig_save_name}",
            "annotated_image": f"/static/uploads/{annotated_name}",
            "plate_text": detected_plate_text,
            "ocr_confidence": ocr_confidence,
            "violations": results["violations"],
            "challan_path": challan_path,
            "motorcyclist_count": len(results["motorcyclists"]),
            "helmet_count": len(results["helmets"]),
            "plate_count": len(results["plates"])
        }
        
        db_records = read_db()
        db_records.append(case_data)
        write_db(db_records)
        
        return jsonify(case_data)
        
    except Exception as e:
        import traceback
        traceback.print_exc()
        return jsonify({"error": f"Pipeline failure: {str(e)}"}), 500

@app.route("/api/stats", methods=["GET"])
def get_stats():
    """
    Returns aggregated stats for the dashboard based on history.
    Since this round is focused solely on helmet violations:
    - total_cases: number of photos uploaded
    - total_violations: number of non-compliant riders
    - total_fines_inr: fines generated (Rs. 1000 per violation)
    - average_ocr_confidence: avg license plate recognition confidence
    - charts: helmet compliance (Compliant vs Non-Compliant) and object counts (Riders, Helmets, Plates)
    """
    records = read_db()
    
    total_cases = len(records)
    total_violations = 0
    total_fines = 0
    ocr_confidences = []
    
    # Helmet compliance stats
    compliant_riders = 0
    non_compliant_riders = 0
    
    # Object detection counts
    total_riders = 0
    total_helmets = 0
    total_plates = 0
    
    for r in records:
        non_compliant = len(r["violations"])
        total_violations += non_compliant
        total_fines += non_compliant * 1000
        
        if r["plate_text"] != "UNKNOWN" and r["ocr_confidence"] > 0:
            ocr_confidences.append(r["ocr_confidence"])
            
        r_riders = r.get("motorcyclist_count", non_compliant)
        r_helmets = r.get("helmet_count", max(0, r_riders - non_compliant))
        r_plates = r.get("plate_count", 1 if r["plate_text"] != "UNKNOWN" else 0)
        
        # Ensure we count properly
        non_compliant_riders += non_compliant
        compliant_riders += max(0, r_riders - non_compliant)
        
        total_riders += r_riders
        total_helmets += r_helmets
        total_plates += r_plates
        
    avg_ocr_conf = sum(ocr_confidences) / len(ocr_confidences) if ocr_confidences else 0.0
    
    return jsonify({
        "summary": {
            "total_cases": total_cases,
            "total_violations": total_violations,
            "total_fines_inr": total_fines,
            "average_ocr_confidence": avg_ocr_conf
        },
        "charts": {
            "compliance": {
                "Compliant Riders": compliant_riders,
                "Non-Compliant Riders": non_compliant_riders
            },
            "objects": {
                "Riders Detected": total_riders,
                "Helmets Detected": total_helmets,
                "Plates Detected": total_plates
            }
        },
        "history": list(reversed(records))
    })

@app.route("/api/clear", methods=["POST"])
def clear_db():
    """Clears history list and deletes files inside uploads directory."""
    try:
        # Delete upload images and PDFs (excluding db.json itself)
        for filename in os.listdir(config.UPLOAD_FOLDER):
            file_path = os.path.join(config.UPLOAD_FOLDER, filename)
            if filename != "db.json" and os.path.isfile(file_path):
                os.remove(file_path)
                
        # Re-initialize database
        with open(DB_PATH, 'w') as f:
            json.dump([], f)
            
        return jsonify({"message": "Data cleared successfully"})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/static/uploads/<path:filename>")
def uploaded_files(filename):
    return send_from_directory(config.UPLOAD_FOLDER, filename)

if __name__ == "__main__":
    init_db()
    # Run the application locally
    app.run(host="0.0.0.0", port=5000, debug=True)

