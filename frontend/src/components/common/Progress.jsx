import { useState, useEffect } from 'react';
import styles from './Progress.module.css';

const Progress = ({ value = 0, max = 100, showLabel = true, animated = true, size = 'md' }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDisplayValue(percentage);
    }, 50);
    return () => clearTimeout(timer);
  }, [percentage]);

  return (
    <div className={`${styles.container} ${styles[size]}`}>
      <div className={styles.bar}>
        <div
          className={`${styles.fill} ${animated ? styles.animated : ''}`}
          style={{ width: `${displayValue}%` }}
          role="progressbar"
          aria-valuenow={Math.round(percentage)}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Progress"
        />
      </div>
      {showLabel && (
        <span className={styles.label} aria-live="polite">
          {Math.round(percentage)}%
        </span>
      )}
    </div>
  );
};

export default Progress;
