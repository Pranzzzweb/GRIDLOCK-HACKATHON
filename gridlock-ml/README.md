# Gridlock Hackathon 2.0 — ML Module

Automated traffic violation detection using YOLOv8n + EasyOCR.

## Structure

    gridlock-ml/
    ├── ml-a/
    │   └── best.pt          # YOLOv8n fine-tuned weights (40 epochs)
    ├── ml-b/                # License plate OCR (EasyOCR)
    ├── traffic_violation_ml.ipynb
    └── requirements.txt

## ML-A: Helmet & Triple Riding Detection
- Model: YOLOv8n fine-tuned on custom dataset
- Classes: motorcyclist, helmet, license_plate
- Helmet detection: IoU-based head-zone logic
- Triple riding detection: Width-ratio heuristic

## ML-B: License Plate OCR
- Tool: EasyOCR
- Input: license_plate crops from YOLOv8n detections

## Setup
    pip install -r requirements.txt

## Model
Weights are in ml-a/best.pt
