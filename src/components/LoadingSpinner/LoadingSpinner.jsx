import React from 'react';
import styles from './LoadingSpinner.module.css';

/**
 * Loading spinner component
 * Displays an animated spinner with optional message
 */
const LoadingSpinner = ({ message = 'Loading...' }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.spinnerContainer}>
        <div className={styles.spinner}>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
          <div className={styles.spinnerRing}></div>
        </div>
        {message && <p className={styles.message}>{message}</p>}
      </div>
    </div>
  );
};

export default LoadingSpinner;
