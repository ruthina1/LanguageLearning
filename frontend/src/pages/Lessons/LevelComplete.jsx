import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaStar, FaTrophy, FaCheckCircle, FaArrowLeft, FaFire } from 'react-icons/fa';
import { GiLaurelsTrophy } from 'react-icons/gi';
import './LevelComplete.css';

export default function LevelComplete() {
  const navigate = useNavigate();
  const location = useLocation();


  const level = location.state?.level || '?';

  return (
    <div className="level-complete-page">
      <div className="celebration-box">
       
        <div className="celebration-icons">
          <GiLaurelsTrophy className="trophy-icon" />
          <FaStar className="star-icon star-1" />
          <FaStar className="star-icon star-2" />
          <FaStar className="star-icon star-3" />
        </div>
        
        <h1>Level Complete!</h1>
        <div className="level-badge">
          <FaTrophy className="level-icon" />
          <span>Level {level}</span>
        </div>
        
        <div className="achievement-message">
          <FaCheckCircle className="check-icon" />
          <p>Amazing progress! You've mastered this level.</p>
        </div>

        <div className="action-buttons">
          <button 
            className="secondary-btn"
            onClick={() => navigate('/lesson')}
          >
            <FaArrowLeft /> Course Overview
          </button>
        </div>
      </div>
    </div>
  );
}