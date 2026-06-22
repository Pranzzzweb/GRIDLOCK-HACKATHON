import React, { useState, useRef } from 'react';
import { FaUpload, FaTimes, FaDownload, FaSpinner, FaFileImage } from 'react-icons/fa';
import { predictViolation } from '../services/api';

const Analyze = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type.startsWith('image/')) {
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      setError('');
    } else {
      setError('Please select a valid image file.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      setFile(droppedFile);
      setPreview(URL.createObjectURL(droppedFile));
      setResult(null);
      setError('');
    } else {
      setError('Please drop a valid image file.');
    }
  };

  const handleRemove = () => {
    setFile(null);
    setPreview(null);
    setResult(null);
    setError('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleAnalyze = async () => {
    if (!file) return;

    setLoading(true);
    setError('');
    const formData = new FormData();
    formData.append('image', file);

    try {
      const data = await predictViolation(formData);
      setResult(data);
    } catch (err) {
      console.error("API Error", err);
      // Fallback dummy data if backend is offline or errors out
      setError('Failed to connect to backend. Displaying mock data for demonstration.');
      setTimeout(() => {
        setResult({
          annotated_image: preview,
          counts: {
            helmet: 1,
            vehicle: 2,
            license_plate: 1
          },
          violations: ['No Helmet', 'Triple Riding'],
          ocr_text: 'DL 4C AB 1234',
          confidence: 0.92,
          inference_time_ms: 145
        });
        setLoading(false);
      }, 1500);
      return;
    }
    setLoading(false);
  };

  return (
    <div className="analyze-page container">
      <div className="page-header">
        <h1>Violation Analysis</h1>
        <p>Upload a traffic image to automatically detect vehicles, helmets, and generate violations.</p>
      </div>

      <div className="analysis-container">
        {/* Upload Section */}
        <div className="card upload-section">
          {!preview ? (
            <div 
              className="drop-zone"
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              onClick={() => fileInputRef.current.click()}
            >
              <FaUpload className="upload-icon" />
              <h3>Drag & Drop Image Here</h3>
              <p>or click to browse from your computer</p>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                accept="image/*" 
                hidden 
              />
            </div>
          ) : (
            <div className="preview-container">
              <img src={preview} alt="Upload preview" className="image-preview" />
              <button className="btn-remove" onClick={handleRemove}>
                <FaTimes />
              </button>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <div className="action-row mt-3 text-center">
            <button 
              className="btn btn-primary" 
              onClick={handleAnalyze} 
              disabled={!file || loading}
              style={{ width: '100%', maxWidth: '300px' }}
            >
              {loading ? (
                <><FaSpinner className="spinner" /> Analyzing...</>
              ) : (
                'Run Analysis'
              )}
            </button>
          </div>
        </div>

        {/* Results Section */}
        {result && (
          <div className="card results-section">
            <h2>Analysis Results</h2>
            
            <div className="results-grid mt-3">
              <div className="result-image">
                <img src={result.annotated_image || preview} alt="Annotated Output" />
              </div>
              
              <div className="result-details">
                <div className="detail-item">
                  <span className="label">Vehicles Detected</span>
                  <span className="value">{result.counts?.vehicle || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="label">Helmets Detected</span>
                  <span className="value">{result.counts?.helmet || 0}</span>
                </div>
                <div className="detail-item">
                  <span className="label">License Plate (OCR)</span>
                  <span className="value highlight">{result.ocr_text || 'Not Detected'}</span>
                </div>
                
                <div className="detail-item violations-box">
                  <span className="label">Violations Flagged</span>
                  <ul className="violation-list">
                    {result.violations?.length > 0 ? (
                      result.violations.map((v, i) => <li key={i} className="violation-item">{v}</li>)
                    ) : (
                      <li className="no-violation">No violations detected</li>
                    )}
                  </ul>
                </div>

                <div className="stats-row">
                  <div className="stat-sm">
                    <span>Confidence</span>
                    <strong>{(result.confidence * 100).toFixed(1)}%</strong>
                  </div>
                  <div className="stat-sm">
                    <span>Inference</span>
                    <strong>{result.inference_time_ms}ms</strong>
                  </div>
                </div>

                <div className="download-actions mt-3">
                  <button className="btn btn-accent btn-sm"><FaFilePdf /> Download Report</button>
                  <button className="btn btn-outline btn-sm"><FaDownload /> Save Image</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .analyze-page {
          padding: 20px;
        }

        .analysis-container {
          max-width: 900px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .drop-zone {
          border: 2px dashed var(--border-color);
          border-radius: 8px;
          padding: 60px 20px;
          text-align: center;
          cursor: pointer;
          background-color: var(--bg-color);
          transition: border-color 0.3s;
        }

        .drop-zone:hover {
          border-color: var(--primary-color);
        }

        .upload-icon {
          font-size: 3rem;
          color: var(--primary-color);
          margin-bottom: 16px;
        }

        .preview-container {
          position: relative;
          text-align: center;
          background: #f9f9f9;
          border-radius: 8px;
          padding: 10px;
        }

        .image-preview {
          max-width: 100%;
          max-height: 400px;
          border-radius: 4px;
        }

        .btn-remove {
          position: absolute;
          top: 20px;
          right: 20px;
          background: rgba(0,0,0,0.6);
          color: white;
          border-radius: 50%;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.3s;
        }

        .btn-remove:hover {
          background: #e74c3c;
        }

        .spinner {
          animation: spin 1s linear infinite;
          margin-right: 8px;
        }

        @keyframes spin {
          100% { transform: rotate(360deg); }
        }

        .error-message {
          color: #e74c3c;
          background: #fadbd8;
          padding: 12px;
          border-radius: 6px;
          margin-top: 16px;
          text-align: center;
        }

        .results-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 32px;
        }

        .result-image img {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--border-color);
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          padding: 12px 0;
          border-bottom: 1px solid var(--border-color);
        }

        .detail-item .label {
          color: #666;
          font-weight: 500;
        }

        .detail-item .value {
          font-weight: 600;
        }

        .value.highlight {
          color: var(--primary-color);
          background: var(--bg-color);
          padding: 2px 8px;
          border-radius: 4px;
        }

        .violations-box {
          flex-direction: column;
          gap: 12px;
          border-bottom: none;
          background: #fff3f3;
          padding: 16px;
          border-radius: 6px;
          margin-top: 16px;
        }

        .violation-list {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .violation-item {
          background: #e74c3c;
          color: white;
          padding: 4px 12px;
          border-radius: 16px;
          font-size: 0.85rem;
          font-weight: 600;
        }

        .no-violation {
          color: #2ecc71;
          font-weight: 600;
        }

        .stats-row {
          display: flex;
          justify-content: space-between;
          margin-top: 24px;
          padding-top: 16px;
          border-top: 1px solid var(--border-color);
        }

        .stat-sm {
          display: flex;
          flex-direction: column;
        }

        .stat-sm span {
          font-size: 0.85rem;
          color: #666;
        }

        .stat-sm strong {
          font-size: 1.1rem;
          color: var(--primary-color);
        }

        .download-actions {
          display: flex;
          gap: 12px;
        }

        .btn-sm {
          padding: 8px 16px;
          font-size: 0.9rem;
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
          justify-content: center;
        }

        @media (max-width: 768px) {
          .results-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default Analyze;
