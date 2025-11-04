// frontend/src/components/Gamification/LevelUpModal.jsx
import React, { useEffect } from 'react';

export default function LevelUpModal ({ show, onClose, newLevel, rewards }) {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="level-up-modal-overlay">
      <div className="level-up-modal">
        <div className="confetti">
          {[...Array(50)].map((_, i) => (
            <div key={i} className="confetti-piece"></div>
          ))}
        </div>

        <div className="level-up-content">
          <div className="level-up-icon">🎉</div>
          <h2>Level Up!</h2>
          <div className="new-level">Level {newLevel}</div>
          <p>Congratulations! You've reached a new milestone.</p>

          {rewards && (
            <div className="rewards-section">
              {rewards.xp && (
                <div className="reward-item">
                  <span>+{rewards.xp} XP Bonus</span>
                </div>
              )}
              {rewards.badges && rewards.badges.length > 0 && (
                <div className="reward-item">
                  <span>New Badges Unlocked!</span>
                </div>
              )}
            </div>
          )}

          <button className="continue-btn" onClick={onClose}>
            Continue Learning
          </button>
        </div>
      </div>
    </div>
  );
};


