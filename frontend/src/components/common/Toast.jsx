import { useContext } from 'react';
import { FiX, FiAlertCircle, FiCheckCircle, FiInfo, FiAlertTriangle } from 'react-icons/fi';
import ToastContext from '@/context/ToastContext';
import styles from './Toast.module.css';

const Toast = () => {
  const { toasts, removeToast } = useContext(ToastContext);

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FiCheckCircle size={20} />;
      case 'error':
        return <FiAlertCircle size={20} />;
      case 'warning':
        return <FiAlertTriangle size={20} />;
      case 'info':
      default:
        return <FiInfo size={20} />;
    }
  };

  return (
    <div className={styles.container} role="region" aria-label="Notifications" aria-live="polite">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`${styles.toast} ${styles[toast.type]}`}
          role="alert"
          aria-live="assertive"
        >
          <div className={styles.content}>
            <span className={styles.icon}>{getIcon(toast.type)}</span>
            <span className={styles.message}>{toast.message}</span>
          </div>
          <button
            onClick={() => removeToast(toast.id)}
            className={styles.closeBtn}
            aria-label="Close notification"
          >
            <FiX size={18} />
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
