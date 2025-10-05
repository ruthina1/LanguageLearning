import React, { useEffect } from 'react';
import './SuccessPopup.css';

export default function SuccessPopup({ message, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000); 

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div className="success-popup-overlay">
      <div className="success-popup">
        <div className="success-popup-icon">
          <div className="checkmark">✓</div>
        </div>
        <div className="success-popup-content">
          <h3>Success!</h3>
          <p>{message}</p>
        </div>
        <button className="success-popup-close" onClick={onClose} aria-label="Close">
          ×
        </button>
        <div className="progress-bar">
          <div className="progress-fill"></div>
        </div>
      </div>
    </div>
  );
}