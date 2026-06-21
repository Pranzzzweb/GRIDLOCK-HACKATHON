import { FiHome } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import Button from '@/components/common/Button';
import styles from './NotFound.module.css';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.notFound}>
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.errorCode}>404</div>
          <h1>Page Not Found</h1>
          <p>Sorry, the page you are looking for doesn't exist or has been moved.</p>
          <Button variant="primary" size="lg" onClick={() => navigate('/')}>
            <FiHome size={20} />
            Back to Home
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
