import { useState, useEffect } from 'react';
import { FiTrash2, FiDownload, FiCalendar } from 'react-icons/fi';
import Card from '@/components/common/Card';
import Button from '@/components/common/Button';
import Badge from '@/components/common/Badge';
import styles from './History.module.css';

const History = () => {
  const [historyItems, setHistoryItems] = useState([]);

  useEffect(() => {
    // Mock history data
    setHistoryItems([
      {
        id: 1,
        fileName: 'traffic_violation_001.jpg',
        date: '2026-06-21',
        time: '14:32:15',
        helmetDetected: true,
        confidence: 95,
        violations: 0,
        status: 'Compliant',
      },
      {
        id: 2,
        fileName: 'traffic_violation_002.jpg',
        date: '2026-06-21',
        time: '13:45:22',
        helmetDetected: false,
        confidence: 92,
        violations: 1,
        status: 'Violation',
      },
      {
        id: 3,
        fileName: 'traffic_violation_003.jpg',
        date: '2026-06-21',
        time: '12:15:48',
        helmetDetected: true,
        confidence: 88,
        violations: 1,
        status: 'Violation',
      },
      {
        id: 4,
        fileName: 'traffic_violation_004.jpg',
        date: '2026-06-20',
        time: '16:22:10',
        helmetDetected: true,
        confidence: 97,
        violations: 0,
        status: 'Compliant',
      },
      {
        id: 5,
        fileName: 'traffic_violation_005.jpg',
        date: '2026-06-20',
        time: '15:10:35',
        helmetDetected: false,
        confidence: 91,
        violations: 2,
        status: 'Violation',
      },
    ]);
  }, []);

  const handleDelete = (id) => {
    setHistoryItems(historyItems.filter((item) => item.id !== id));
  };

  const handleDownload = (fileName) => {
    // Mock download
    console.log(`Downloading ${fileName}`);
  };

  return (
    <div className={styles.history}>
      <div className={styles.container}>
        {/* Header */}
        <div className={styles.header}>
          <h1>Analysis History</h1>
          <p>View all your previous image analyses and results</p>
        </div>

        {/* Timeline */}
        <div className={styles.timeline}>
          {historyItems.length > 0 ? (
            historyItems.map((item) => (
              <Card key={item.id} variant="default" className={styles.historyCard}>
                <div className={styles.cardContent}>
                  <div className={styles.cardHeader}>
                    <div className={styles.cardInfo}>
                      <h3 className={styles.fileName}>{item.fileName}</h3>
                      <div className={styles.metadata}>
                        <span className={styles.datetime}>
                          <FiCalendar size={14} />
                          {item.date} at {item.time}
                        </span>
                      </div>
                    </div>
                    <Badge variant={item.status === 'Compliant' ? 'success' : 'danger'}>
                      {item.status}
                    </Badge>
                  </div>

                  <div className={styles.results}>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Helmet Detected</span>
                      <span className={styles.resultValue}>
                        {item.helmetDetected ? '✓ Yes' : '✗ No'}
                      </span>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Confidence</span>
                      <span className={styles.resultValue}>{item.confidence}%</span>
                    </div>
                    <div className={styles.resultItem}>
                      <span className={styles.resultLabel}>Violations</span>
                      <Badge
                        variant={item.violations > 0 ? 'danger' : 'success'}
                        size="sm"
                      >
                        {item.violations}
                      </Badge>
                    </div>
                  </div>

                  <div className={styles.actions}>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(item.fileName)}
                      title="Download analysis report"
                    >
                      <FiDownload size={16} />
                      Download
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDelete(item.id)}
                      title="Delete this record"
                    >
                      <FiTrash2 size={16} />
                      Delete
                    </Button>
                  </div>
                </div>
              </Card>
            ))
          ) : (
            <Card variant="default" className={styles.emptyState}>
              <div className={styles.emptyContent}>
                <div className={styles.emptyIcon}>📋</div>
                <h2>No analysis history yet</h2>
                <p>Start analyzing images to see your history here</p>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
