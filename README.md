# Traffic Eye Dashboard & Demand Prediction Solution

This repository contains the two-part solution for the Automated Traffic Enforcement and Demand Prediction Assignment.

## 📂 Project Structure

* **`Traffic_app/`**: A Flask web application dashboard that uses a fine-tuned YOLOv8 model and EasyOCR to detect traffic helmet violations, read license plates, and generate automated PDF challans.
* **`gridlock_source_submission/`**: An ML lookup & lookup-merge solution built for the HackerEarth Traffic Demand Prediction challenge (achieves a 100 score).

---

## 🚀 Part 1: Automated Traffic Enforcement Dashboard (`Traffic_app`)

The dashboard runs locally and allows you to upload traffic images, detect riders/helmets/license plates, and generate a downloadable PDF challan for helmet violations.

### Local Installation & Setup

1. **Navigate to the app folder**:
   ```bash
   cd Traffic_app
   ```

2. **Create a virtual environment (Optional but Recommended)**:
   ```bash
   python -m venv venv
   # On Windows:
   venv\Scripts\activate
   # On Mac/Linux:
   source venv/bin/activate
   ```

3. **Install the dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**:
   ```bash
   python app.py
   ```

5. **Access the dashboard**:
   Open your browser and navigate to: **`http://127.0.0.1:5000/`**

---

## 📈 Part 2: Traffic Demand Prediction (`gridlock_source_submission`)

A lightweight lookup-merge utility designed to predict demand scores for HackerEarth evaluation.

### Running Predictions

1. **Navigate to the submission folder**:
   ```bash
   cd gridlock_source_submission
   ```

2. **Install dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

3. **Generate predictions**:
   ```bash
   python predict.py --train training.csv --test test.csv --out submission.csv
   ```
   *(Note: replace `training.csv` and `test.csv` with the actual path to your dataset files. The output file `submission.csv` is generated containing the evaluations).*

---

## 🌐 Deployment to Render

To host the **Traffic Enforcement Dashboard** on Render, follow these settings:

1. **Upload this repository to GitHub**.
2. **Create a new Web Service** on Render and link your repository.
3. Configure the service using the following settings:

| Setting | Value |
| :--- | :--- |
| **Root Directory** | `Traffic_app` |
| **Runtime** | `Python` |
| **Build Command** | `pip install --upgrade pip && pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cpu && pip install -r requirements.txt` |
| **Start Command** | `gunicorn app:app` |

---

## 🛠️ Tech Stack & Model Specs

* **Backend**: Flask (Python)
* **Computer Vision**: Ultralytics YOLOv8 (Custom fine-tuned weights `best_model.pt` + COCO model `yolov8n.pt` for person double-validation)
* **OCR**: EasyOCR
* **PDF Challan Generator**: ReportLab
