import styles from './Card.module.css';

const Card = ({ children, className = '', variant = 'default', ...props }) => {
  return (
    <div className={`${styles.card} ${styles[variant]} ${className}`} {...props}>
      {children}
    </div>
  );
};

export default Card;
