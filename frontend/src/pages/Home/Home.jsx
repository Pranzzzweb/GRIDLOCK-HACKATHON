import { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiUploadCloud, FiPlay, FiBarChart3, FiClock } from 'react-icons/fi';
import Button from '@/components/common/Button';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import ToastContext from '@/context/ToastContext';
import { validateImageFile } from '@/utils/formatting';
import styles from './Home.module.css';

const Home = () => {
  const navigate = useNavigate();
  const { success, error } = useContext(ToastContext);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const validation = validateImageFile(files[0]);
      if (validation.valid) {
        success('Image ready for analysis!');
        navigate('/analyze', { state: { file: files[0] } });
      } else {
        error(validation.error);
      }
    }
  };

  const features = [
    {
      icon: '🎥',
      title: 'Real-time Detection',
      description: 'AI-powered detection of traffic violations including helmet usage compliance',
    },
    {
      icon: '📊',
      title: 'Analytics Dashboard',
      description: 'Comprehensive insights into traffic violations and helmet compliance rates',
    },
    {
      icon: '📁',
      title: 'History Tracking',
      description: 'Complete history of all analyzed images and violations detected',
    },
    {
      icon: '🔒',
      title: 'Secure & Private',
      description: 'Enterprise-grade security ensuring data privacy and protection',
    },
  ];

  const stats = [
    { label: 'Images Analyzed', value: '10,234+' },
    { label: 'Violations Detected', value: '3,421' },
    { label: 'Compliance Rate', value: '87%' },
    { label: 'Active Cities', value: '12' },
  ];

  return (
    <div className={styles.home}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <Badge variant="primary" className={styles.badge}>
              🚀 National AI Initiative
            </Badge>
            <h1 className={styles.title}>Smart Helmet Portal</h1>
            <p className={styles.subtitle}>
              Advanced AI-Powered Road Safety Monitoring System for Helmet Compliance Detection
            </p>
            <p className={styles.description}>
              Leveraging computer vision and machine learning to enhance road safety by monitoring
              helmet usage compliance and detecting traffic violations in real-time.
            </p>
            <div className={styles.heroActions}>
              <Button size="lg" onClick={() => navigate('/analyze')}>
                <FiPlay size={20} />
                Start Analysis
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/about')}>
                Learn More
              </Button>
            </div>
          </div>
          <div className={styles.heroImage}>
            <div className={styles.imagePlaceholder}>🛡️</div>
          </div>
        </div>
      </section>

      {/* Upload Section */}
      <section className={styles.uploadSection}>
        <div className={styles.container}>
          <h2>Upload Image for Analysis</h2>
          <div
            className={`${styles.uploadBox} ${dragActive ? styles.active : ''}`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <FiUploadCloud size={48} className={styles.uploadIcon} />
            <h3>Drag and drop your image here</h3>
            <p>or click below to select a file</p>
            <Button variant="secondary" size="md" onClick={() => navigate('/analyze')}>
              Select Image
            </Button>
            <p className={styles.uploadHint}>
              Supported formats: JPEG, PNG, WebP (Max 10MB)
            </p>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Key Features</h2>
          <div className={styles.featureGrid}>
            {features.map((feature, index) => (
              <Card key={index} variant="default" className={styles.featureCard}>
                <div className={styles.featureIcon}>{feature.icon}</div>
                <h3 className={styles.featureTitle}>{feature.title}</h3>
                <p className={styles.featureDescription}>{feature.description}</p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className={styles.stats}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>System Performance</h2>
          <div className={styles.statsGrid}>
            {stats.map((stat, index) => (
              <Card key={index} variant="flat" className={styles.statCard}>
                <div className={styles.statValue}>{stat.value}</div>
                <div className={styles.statLabel}>{stat.label}</div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>Ready to Enhance Road Safety?</h2>
            <p>
              Start analyzing images with our AI-powered helmet detection system to ensure traffic
              compliance and road safety.
            </p>
            <div className={styles.ctaActions}>
              <Button size="lg" onClick={() => navigate('/analyze')}>
                <FiPlay size={20} />
                Begin Analysis
              </Button>
              <Button variant="outline" size="lg" onClick={() => navigate('/analytics')}>
                <FiBarChart3 size={20} />
                View Analytics
              </Button>
              <Button variant="ghost" size="lg" onClick={() => navigate('/history')}>
                <FiClock size={20} />
                Check History
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
