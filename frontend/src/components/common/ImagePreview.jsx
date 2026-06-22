import { useState } from 'react';
import { FiImage } from 'react-icons/fi';
import styles from './ImagePreview.module.css';

const ImagePreview = ({ src, alt = 'Preview', onRemove }) => {
  const [imageDimensions, setImageDimensions] = useState(null);

  const handleImageLoad = (e) => {
    setImageDimensions({
      width: e.target.naturalWidth,
      height: e.target.naturalHeight,
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.imageWrapper}>
        <img src={src} alt={alt} onLoad={handleImageLoad} />
      </div>
      {imageDimensions && (
        <div className={styles.info}>
          <div className={styles.dimensions}>
            <FiImage size={16} />
            <span>
              {imageDimensions.width} × {imageDimensions.height}px
            </span>
          </div>
          {onRemove && (
            <button onClick={onRemove} className={styles.removeBtn} aria-label="Remove image">
              Remove
            </button>
          )}
        </div>
      )}
    </div>
  );
};

export default ImagePreview;
