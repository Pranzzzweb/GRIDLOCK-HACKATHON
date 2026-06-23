# GRIDLOCK — Automated Traffic Violation Detection

This prototype is a traffic surveillance prototype that uses computer vision to detect helmet violations from traffic images, highlight violations on the image, extract plate details when possible, and generate an e-challan style report.

## What it does

* Upload a traffic image
* Detect motorcycles / riders, helmets, and license plates
* Flag helmet non-compliance
* Generate an annotated result image
* Create a PDF challan/report
* Store the session in a simple JSON-based history log
* Show live stats and past violation records in the dashboard

## Tech Stack

**Frontend**

* React
* Vite
* Axios
* React Icons

**Backend**

* Python
* Flask
* Flask-CORS
* Ultralytics YOLO
* OpenCV
* EasyOCR
* ReportLab
* Torch / PyTorch
* Gunicorn

**Storage**

* Local JSON file for history (`db.json`)
* Uploaded images and generated PDFs in `backend/static/uploads/`

## Live Demo Links

**Frontend**

```text
https://incandescent-daifuku-9503e3.netlify.app/
```

**Backend**

```text
https://gridlock-hackathon.onrender.com/
```

> Note: The backend API is deployed, but heavy ML inference can hit free-tier memory limits on Render. For a fully reliable demo, run the backend locally.

## Project Structure

```text
GRIDLOCK-HACKATHON/
├── backend/
│   ├── app.py
│   ├── config.py
│   ├── model.py
│   ├── utils.py
│   ├── report.py
│   ├── requirements.txt
│   ├── templates/
│   ├── static/
│   │   └── uploads/
│   └── ...
├── frontend/
│   ├── src/
│   ├── public/
│   ├── package.json
│   └── ...
└── README.md
```

## How to Run Locally

```bash
cd backend
python -m venv venv
```

Activate the virtual environment:

**Windows**

```bash
venv\Scripts\activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

Run the Flask app:

```bash
python app.py
```

Open:

```text
http://127.0.0.1:5000/
```

## Important API Routes

### `POST /api/upload`

Uploads an image and runs the detection pipeline.

**Expected form field:**

* `image`

### `GET /api/stats`

Returns:

* total cases processed
* total violations
* total fines
* compliance chart data
* object counts
* session history

### `POST /api/clear`

Clears stored history and deletes uploaded/generated files.

### `GET /static/uploads/<filename>`

Serves annotated images and PDF challans.

## How the workflow works

1. User uploads a traffic image
2. Flask saves the file locally
3. OpenCV preprocesses the image
4. YOLO model detects riders / helmets / plates
5. Violation logic checks for helmet non-compliance
6. OCR tries to extract plate text when available
7. Annotated image is created
8. PDF challan is generated
9. Session data is saved into `db.json`
10. Frontend/dashboard displays the result

## Demo Notes

For a clean demo, use a clear traffic image with:

* one or more riders
* at least one visible helmet violation
* a visible license plate if possible

If OCR returns `UNKNOWN`, that usually means the plate was not clear enough in the image.

## Deployment Notes

* Frontend is deployed on Netlify
* Backend is deployed on Render, but the free instance can run out of memory during heavy inference
* If the backend crashes on cloud inference, run the backend locally during the demo

## Credits

Built as a hackathon prototype for automated traffic violation detection and e-challan generation.
