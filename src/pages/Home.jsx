import React from 'react';
import { Link } from 'react-router-dom';
import { FaCamera, FaChartBar, FaSearchLocation, FaFilePdf } from 'react-icons/fa';

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="container hero-content">
          <h1>Automated Photo Identification & Classification for Traffic Violations</h1>
          <p className="hero-subtitle">
            An AI-powered computer vision system to detect traffic violations including non-compliance with helmets, wrong-side driving, and more.
          </p>
          <div className="hero-actions">
            <Link to="/analyze" className="btn btn-primary">Start Analysis</Link>
            <Link to="/about" className="btn btn-outline">Learn More</Link>
          </div>
        </div>
      </section>

      <section className="features container">
        <h2 className="section-title text-center">Key Features</h2>
        <div className="features-grid">
          <div className="feature-card card">
            <div className="feature-icon"><FaCamera /></div>
            <h3>Violation Detection</h3>
            <p>Automatically detects vehicles, riders, and identifies specific traffic violations using YOLOv8.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><FaSearchLocation /></div>
            <h3>License Plate OCR</h3>
            <p>Extracts registration plates with high accuracy using EasyOCR for automated challan generation.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><FaChartBar /></div>
            <h3>Analytics Dashboard</h3>
            <p>Monitors violation statistics, trends, and evaluates model performance dynamically.</p>
          </div>
          <div className="feature-card card">
            <div className="feature-icon"><FaFilePdf /></div>
            <h3>Evidence Generation</h3>
            <p>Produces annotated images with bounding boxes and auto-generates PDF reports.</p>
          </div>
        </div>
      </section>

      <style>{`
        .home-page {
          padding-bottom: 60px;
        }

        .hero {
          background-color: var(--primary-color);
          color: white;
          padding: 80px 0;
          text-align: center;
          margin-bottom: 60px;
        }

        .hero-subtitle {
          font-size: 1.2rem;
          max-width: 700px;
          margin: 20px auto 40px;
          color: #e0e0e0;
        }

        .hero-actions {
          display: flex;
          gap: 16px;
          justify-content: center;
        }

        .hero-actions .btn-outline {
          color: white;
          border-color: white;
        }

        .hero-actions .btn-outline:hover {
          background-color: white;
          color: var(--primary-color);
        }

        .section-title {
          margin-bottom: 40px;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 24px;
        }

        .feature-card {
          text-align: center;
          transition: transform 0.3s;
        }

        .feature-card:hover {
          transform: translateY(-5px);
        }

        .feature-icon {
          font-size: 2.5rem;
          color: var(--accent-color);
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          .hero h1 { font-size: 2rem; }
          .hero-subtitle { font-size: 1rem; }
        }
      `}</style>
    </div>
  );
};

export default Home;
