import os
import random
import datetime
import cv2
from reportlab.lib.pagesizes import letter
from reportlab.platypus import SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, Image, KeepTogether
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib import colors
from reportlab.lib.units import inch

def generate_challan_pdf(data, output_path):
    """
    Generates a professional PDF E-Challan.
    
    data format:
    {
        "challan_id": str,
        "timestamp": str,
        "plate_text": str,
        "ocr_confidence": float,
        "violations": list of dicts with {"type", "confidence", "severity"},
        "image_path": str, (original image path)
        "annotated_image_path": str, (annotated image path)
        "plate_box": list of 4 floats (optional, [x1, y1, x2, y2])
    }
    """
    # 1. Page settings
    doc = SimpleDocTemplate(
        output_path,
        pagesize=letter,
        rightMargin=40, leftMargin=40, topMargin=40, bottomMargin=40
    )
    
    styles = getSampleStyleSheet()
    
    # Custom styles
    style_title = ParagraphStyle(
        name='TitleStyle',
        parent=styles['Heading1'],
        fontName='Helvetica-Bold',
        fontSize=20,
        textColor=colors.HexColor('#1A365D'),
        spaceAfter=5
    )
    
    style_subtitle = ParagraphStyle(
        name='SubtitleStyle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=10,
        textColor=colors.HexColor('#718096'),
        spaceAfter=15
    )
    
    style_section_heading = ParagraphStyle(
        name='SectionHeading',
        parent=styles['Heading2'],
        fontName='Helvetica-Bold',
        fontSize=12,
        textColor=colors.HexColor('#2B6CB0'),
        spaceBefore=10,
        spaceAfter=6
    )
    
    style_normal = ParagraphStyle(
        name='NormalStyle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=9,
        textColor=colors.HexColor('#2D3748'),
        leading=13
    )

    style_bold = ParagraphStyle(
        name='BoldStyle',
        parent=style_normal,
        fontName='Helvetica-Bold'
    )
    
    style_alert = ParagraphStyle(
        name='AlertStyle',
        parent=style_normal,
        textColor=colors.HexColor('#E53E3E'),
        fontName='Helvetica-Bold'
    )

    story = []
    
    # --- HEADER SECTION ---
    # Official logo placeholder or header
    header_data = [
        [
            Paragraph("<b>BENGALURU CITY POLICE</b>", style_title),
            Paragraph(f"<b>Challan ID:</b> {data['challan_id']}<br/><b>Date:</b> {data['timestamp']}", style_normal)
        ],
        [
            Paragraph("AUTOMATED TRAFFIC VIOLATION CITATION", style_subtitle),
            ""
        ]
    ]
    header_table = Table(header_data, colWidths=[4.0*inch, 3.2*inch])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'TOP'),
        ('SPAN', (0,1), (1,1)),
        ('BOTTOMPADDING', (0,0), (-1,-1), 0),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 10))
    
    # --- VEHICLE & CITATION DETAILS ---
    details_title = Paragraph("<b>1. VEHICLE & CITATION DETAILS</b>", style_section_heading)
    story.append(details_title)
    
    plate_text = data.get("plate_text", "UNKNOWN").upper()
    ocr_conf = f"{data.get('ocr_confidence', 0.0) * 100:.1f}%" if plate_text != "UNKNOWN" else "N/A"
    
    # Detail Table Layout
    detail_rows = [
        [Paragraph("<b>Vehicle License Plate:</b>", style_normal), Paragraph(plate_text, style_bold),
         Paragraph("<b>OCR Confidence:</b>", style_normal), Paragraph(ocr_conf, style_normal)],
        [Paragraph("<b>Citation Status:</b>", style_normal), Paragraph("PENDING PAYMENT", style_alert),
         Paragraph("<b>Fine Amount (INR):</b>", style_normal), Paragraph(f"<b>Rs. {len(data['violations']) * 1000}</b>", style_bold)],
        [Paragraph("<b>Issuing Authority:</b>", style_normal), Paragraph("Bengaluru City Police Department", style_normal),
         Paragraph("<b>Detection System:</b>", style_normal), Paragraph("BCP Traffic Eye v1.0", style_normal)]
    ]
    detail_table = Table(detail_rows, colWidths=[1.8*inch, 1.9*inch, 1.8*inch, 1.7*inch])
    detail_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#F7FAFC')),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#EDF2F7')),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(detail_table)
    story.append(Spacer(1, 10))
    
    # --- VIOLATIONS SECTION ---
    violations_title = Paragraph("<b>2. REGISTERED TRAFFIC VIOLATIONS</b>", style_section_heading)
    story.append(violations_title)
    
    violation_headers = [
        Paragraph("<b>#</b>", style_bold),
        Paragraph("<b>Violation Description</b>", style_bold),
        Paragraph("<b>Severity</b>", style_bold),
        Paragraph("<b>Fine (INR)</b>", style_bold)
    ]
    
    violation_rows = [violation_headers]
    for idx, v in enumerate(data["violations"]):
        v_type = v.get("type", "Traffic Violation")
        severity = v.get("severity", "High")
        fine = "Rs. 1000.00" # Standardized fine per violation
        
        # Color code severity
        sev_color = "red" if severity == "High" else "orange"
        
        violation_rows.append([
            Paragraph(str(idx + 1), style_normal),
            Paragraph(v_type, style_normal),
            Paragraph(f"<font color='{sev_color}'><b>{severity}</b></font>", style_normal),
            Paragraph(fine, style_bold)
        ])
        
    v_table = Table(violation_rows, colWidths=[0.5*inch, 3.5*inch, 1.6*inch, 1.6*inch])
    v_table.setStyle(TableStyle([
        ('BACKGROUND', (0,0), (-1,0), colors.HexColor('#EDF2F7')),
        ('ALIGN', (0,0), (-1,-1), 'LEFT'),
        ('BOTTOMPADDING', (0,0), (-1,-1), 6),
        ('TOPPADDING', (0,0), (-1,-1), 6),
        ('BOX', (0,0), (-1,-1), 1, colors.HexColor('#CBD5E0')),
        ('INNERGRID', (0,0), (-1,-1), 0.5, colors.HexColor('#E2E8F0')),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
    ]))
    story.append(v_table)
    story.append(Spacer(1, 10))
    
    # --- EVIDENCE SECTION ---
    evidence_title = Paragraph("<b>3. EVIDENCE REPORT (PHOTOGRAPHIC PROOF)</b>", style_section_heading)
    story.append(evidence_title)
    
    # Create photographic evidence block
    # We will display the annotated image resized to fit the width.
    evidence_flowables = []
    
    annotated_img_path = data.get("annotated_image_path")
    
    try:
        if annotated_img_path and os.path.exists(annotated_img_path):
            img_cv = cv2.imread(annotated_img_path)
            h, w = img_cv.shape[:2]
            aspect = h / w
            target_width = 4.8 * inch # Clean, wide presentation
            target_height = int(target_width * aspect)
            
            # Annotated Full Image flowable
            full_img_flowable = Image(annotated_img_path, width=target_width, height=target_height)
            
            # Layout centered Full Scene Detection
            evidence_table_data = [
                [Paragraph("<b>Full Scene Detection:</b>", style_normal)],
                [full_img_flowable]
            ]
            evidence_table = Table(evidence_table_data, colWidths=[6.8*inch])
            evidence_table.setStyle(TableStyle([
                ('ALIGN', (0,0), (-1,-1), 'CENTER'),
                ('VALIGN', (0,0), (-1,-1), 'TOP'),
                ('BOTTOMPADDING', (0,0), (-1,-1), 4),
                ('TOPPADDING', (0,0), (-1,-1), 4),
            ]))
            evidence_flowables.append(evidence_table)
        else:
            evidence_flowables.append(Paragraph("<i>No photographic evidence available.</i>", style_normal))
    except Exception as img_err:
        print("Error displaying image in ReportLab PDF:", img_err)
        evidence_flowables.append(Paragraph(f"<i>Error rendering image: {str(img_err)}</i>", style_normal))
        
    story.extend(evidence_flowables)
    story.append(Spacer(1, 10))
    
    # --- PAYMENT & LEGAL INSTRUCTIONS ---
    legal_section = []
    legal_section.append(Paragraph("<b>4. PAYMENT & LEGAL NOTICE</b>", style_section_heading))
    legal_text = (
        "This challan has been generated automatically by an AI-assisted Traffic Safety System. "
        "Under Section 177/129 of the Motor Vehicles Act, the owner of the vehicle listed above is required to "
        "pay the specified fine within 15 days of this notice. "
        "<br/><br/>"
        "<b>How to Pay:</b><br/>"
        "1. Scan the QR code below or visit the official portal: <u>https://echallan.parivahan.gov.in/</u><br/>"
        "2. Enter the Challan ID or Vehicle License Plate to complete payment."
    )
    
    # Generate QR Code mockup (using table/drawing or text blocks, or a pre-defined image if we have one)
    # We can mock a QR code layout in reportlab or write a simple box
    qr_data = [
        [
            Paragraph(legal_text, style_normal),
            # Mock barcode / QR representation
            Paragraph("<font size='7' face='Courier'><b>[MOCK_BARCODE_PAYMENT_ID]<br/>||||| | ||||| || ||| ||||<br/>SCAN OR PAY ONLINE</b></font>", style_bold)
        ]
    ]
    qr_table = Table(qr_data, colWidths=[5.4*inch, 1.8*inch])
    qr_table.setStyle(TableStyle([
        ('VALIGN', (0,0), (-1,-1), 'MIDDLE'),
        ('BACKGROUND', (0,0), (-1,-1), colors.HexColor('#EDF2F7')),
        ('BOX', (0,0), (-1,-1), 0.5, colors.HexColor('#CBD5E0')),
        ('TOPPADDING', (0,0), (-1,-1), 8),
        ('BOTTOMPADDING', (0,0), (-1,-1), 8),
        ('LEFTPADDING', (0,0), (-1,-1), 8),
        ('RIGHTPADDING', (0,0), (-1,-1), 8),
    ]))
    legal_section.append(qr_table)
    
    # Add footer sign-off
    legal_section.append(Spacer(1, 15))
    legal_section.append(Paragraph("<font color='#A0AEC0' size='7'>This is a computer-generated document. No signature is required. Issued by Digital Traffic Enforcement System.</font>", style_normal))
    
    story.append(KeepTogether(legal_section))
    
    # Build PDF
    doc.build(story)
