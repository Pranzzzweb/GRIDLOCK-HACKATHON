import { useState, useRef, useContext } from 'react';
import { FiUploadCloud, FiPlay, FiRotateCcw } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Loader from '@/components/common/Loader';
import Progress from '@/components/common/Progress';
import ImagePreview from '@/components/common/ImagePreview';
import Badge from '@/components/common/Badge';
import ToastContext from '@/context/ToastContext';
import { analyzeImage } from '@/services/endpoints';
import { validateImageFile } from '@/utils/formatting';
import styles from './Analyze.module.css';

const Analyze = () => {
  const { success, error } = useContext(ToastContext);
  const fileInputRef = useRef(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const handleFileSelect = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file) => {
    const validation = validateImageFile(file);
    if (!validation.valid) {
      error(validation.error);
      return;
    }

    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result);
    };
    reader.readAsDataURL(file);
  };

  const handleAnalyze = async () => {
    if (!selectedFile) {
      error('Please select an image first');
      return;
    }

    setLoading(true);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('image', selectedFile);

      // Simulate progress
      const progressInterval = setInterval(() => {
        setUploadProgress((prev) => Math.min(prev + 10, 90));
      }, 100);

      const result = await analyzeImage(formData);

      clearInterval(progressInterval);
      setUploadProgress(100);
      setAnalysisResult(result);
      success('Analysis completed successfully!');
    } catch (err) {
      error(err.message || 'Analysis failed. Please try again.');
    } finally {
      setLoading(false);
      setUploadProgress(0);
    }
  };

  const handleReset = () => {
    setSelectedFile(null);
    setPreview(null);
    setAnalysisResult(null);
    setUploadProgress(0);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className={styles.analyze}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Helmet Detection Analysis</h1>
          <p>Upload an image to detect helmet usage and traffic violations</p>
        </div>

        <div className={styles.grid}>
          {/* Upload Section */}
          <Card variant="default" className={styles.uploadCard}>
            <h2 className={styles.cardTitle}>1. Select Image</h2>
            {!preview ? (
              <div className={styles.uploadArea}>
                <FiUploadCloud size={48} className={styles.uploadIcon} />
                <h3>Click to select image</h3>
                <p>or drag and drop</p>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className={styles.fileInput}
                  aria-label="Select image for analysis"
                />
                <Button
                  variant="primary"
                  onClick={() => fileInputRef.current?.click()}
                  className={styles.selectBtn}
                >
                  Browse Files
                </Button>
                <p className={styles.hint}>Supported: JPEG, PNG, WebP (Max 10MB)</p>
              </div>
            ) : (
              <>
                <ImagePreview src={preview} onRemove={handleReset} />
                <div className={styles.fileInfo}>
                  <div>
                    <p className={styles.label}>File Name</p>
                    <p className={styles.value}>{selectedFile?.name}</p>
                  </div>
                  <div>
                    <p className={styles.label}>File Size</p>
                    <p className={styles.value}>
                      {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                </div>
              </>
            )}
          </Card>

          {/* Analysis Section */}
          <Card variant="default" className={styles.analysisCard}>
            <h2 className={styles.cardTitle}>2. Run Analysis</h2>
            {loading ? (
              <Loader message="Analyzing image..." />
            ) : analysisResult ? (
              <div className={styles.results}>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Helmet Detected</span>
                  <Badge variant={analysisResult.helmet_detected ? 'success' : 'danger'}>
                    {analysisResult.helmet_detected ? 'Yes' : 'No'}
                  </Badge>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Confidence</span>
                  <span className={styles.value}>{analysisResult.confidence}%</span>
                </div>
                <div className={styles.resultItem}>
                  <span className={styles.label}>Violations Detected</span>
                  <Badge variant={analysisResult.violations_count > 0 ? 'danger' : 'success'}>
                    {analysisResult.violations_count}
                  </Badge>
                </div>
                {analysisResult.violations_count > 0 && (
                  <div className={styles.violations}>
                    <p className={styles.violationsTitle}>Violations:</p>
                    <ul>
                      {analysisResult.violations?.map((violation, i) => (
                        <li key={i}>{violation}</li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            ) : (
              <div className={styles.analysisPlaceholder}>
                <p>Upload an image and click analyze to see results</p>
              </div>
            )}

            {uploadProgress > 0 && (
              <div className={styles.progressContainer}>
                <Progress value={uploadProgress} max={100} showLabel={true} />
              </div>
            )}

            <div className={styles.actions}>
              <Button
                variant="primary"
                size="lg"
                onClick={handleAnalyze}
                disabled={!preview || loading}
                fullWidth
              >
                <FiPlay size={20} />
                {loading ? 'Analyzing...' : 'Analyze Image'}
              </Button>
              {analysisResult && (
                <Button
                  variant="outline"
                  size="lg"
                  onClick={handleReset}
                  fullWidth
                >
                  <FiRotateCcw size={20} />
                  Start Over
                </Button>
              )}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Analyze;
