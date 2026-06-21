import { useState, useEffect } from 'react';
import { FiArrowUp } from 'react-icons/fi';
import styles from './ScrollToTop.module.css';

const ScrollToTop = () => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    if (window.pageYOffset > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
    };
  }, []);

  return (
    <button
      onClick={scrollToTop}
      className={`${styles.button} ${isVisible ? styles.visible : ''}`}
      aria-label="Scroll to top"
      title="Scroll to top"
    >
      <FiArrowUp size={20} />
    </button>
  );
};

export default ScrollToTop;
