import { FiLoader } from 'react-icons/fi';
import styles from './Loader.module.css';

const Loader = ({ size = 'md', fullScreen = false, message = '' }) => {
  const sizeMap = {
    sm: 24,
    md: 48,
    lg: 64,
    xl: 96,
  };

  const loaderContent = (
    <div className={styles.content}>
      <div className={styles.spinnerWrapper}>
        <FiLoader size={sizeMap[size]} className={styles.spinner} />
      </div>
      {message && <p className={styles.message}>{message}</p>}
    </div>
  );

  if (fullScreen) {
    return <div className={styles.fullScreen}>{loaderContent}</div>;
  }

  return <div className={styles.container}>{loaderContent}</div>;
};

export default Loader;
