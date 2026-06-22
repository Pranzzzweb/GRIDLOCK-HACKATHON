import React from 'react';

const About = () => {
  return (
    <div className="about-page container">
      <div className="page-header">
        <h1>About the Project</h1>
        <p>Learn more about the Smart Helmet & Traffic Violation Detection System.</p>
      </div>

      <div className="about-content">
        <div className="card mb-4">
          <h2>Project Overview</h2>
          <p>
            The Automated Photo Identification & Classification system is designed to streamline traffic enforcement. 
            By leveraging advanced computer vision algorithms, the system processes raw traffic surveillance images to 
            automatically detect non-compliance with traffic rules, particularly focusing on two-wheeler helmet compliance 
            and improper riding.
          </p>
        </div>

        <div className="card mb-4">
          <h2>How It Works (AI Pipeline)</h2>
          <div className="pipeline-steps">
            <div className="step">
              <div className="step-number">1</div>
              <h4>Image Preprocessing</h4>
              <p>Image enhancement, normalization, and handling of challenging lighting conditions.</p>
            </div>
            <div className="step">
              <div className="step-number">2</div>
              <h4>Detection (YOLOv8)</h4>
              <p>Object detection localizes vehicles, riders, and pedestrians.</p>
            </div>
            <div className="step">
              <div className="step-number">3</div>
              <h4>Violation Classification</h4>
              <p>Rule-based logic combined with AI categorizes the specific violation type.</p>
            </div>
            <div className="step">
              <div className="step-number">4</div>
              <h4>OCR (EasyOCR)</h4>
              <p>Extracts the text from the license plate bounding box to identify the vehicle.</p>
            </div>
          </div>
        </div>

        <div className="grid-2 mb-4">
          <div className="card">
            <h2>Tech Stack</h2>
            <ul className="tech-list">
              <li><strong>Frontend:</strong> React, Vite, HTML/CSS</li>
              <li><strong>Backend:</strong> Python, Flask/FastAPI</li>
              <li><strong>AI Models:</strong> YOLOv8 (Ultralytics), EasyOCR</li>
              <li><strong>Data Viz:</strong> Chart.js</li>
            </ul>
          </div>
          <div className="card">
            <h2>Future Scope</h2>
            <ul className="tech-list">
              <li>Live webcam feed integration</li>
              <li>Automated e-challan integration via VAHAN</li>
              <li>Edge computing deployment for real-time processing</li>
              <li>Weather-adaptive detection models</li>
            </ul>
          </div>
        </div>
      </div>

      <style>{`
        .about-page {
          padding: 20px;
        }

        .about-content {
          max-width: 900px;
          margin: 0 auto;
        }

        .pipeline-steps {
          display: flex;
          flex-direction: column;
          gap: 20px;
          margin-top: 20px;
        }

        .step {
          display: flex;
          align-items: flex-start;
          gap: 16px;
          padding: 16px;
          background: var(--bg-color);
          border-radius: 8px;
          border-left: 4px solid var(--accent-color);
        }

        .step-number {
          background: var(--primary-color);
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          flex-shrink: 0;
        }

        .step h4 {
          margin-bottom: 4px;
        }

        .step p {
          margin: 0;
          color: #555;
          font-size: 0.95rem;
        }

        .grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 24px;
        }

        .tech-list {
          padding-left: 20px;
        }

        .tech-list li {
          margin-bottom: 8px;
          list-style-type: disc;
        }

        @media (max-width: 768px) {
          .grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default About;
