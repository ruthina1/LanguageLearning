// frontend/src/components/Lessons/LessonCompletion.jsx
import React, { useEffect } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import LevelUpModal from '../Gamification/LevelUpModal';

export default function LessonCompletion ({ lessonResult, onContinue, onReview }) {
  const { addXP, updateStreak, checkForNewAchievements, showLevelUp, setShowLevelUp, currentLevel } = useGamification();

  useEffect(() => {
    // Award XP and update streak when component mounts
    const awardRewards = async () => {
      await addXP(lessonResult.xpEarned, 'lesson_completion');
      await updateStreak();
      await checkForNewAchievements('lesson_completed', {
        score: lessonResult.score,
        correctAnswers: lessonResult.correctAnswers
      });
    };

    awardRewards();
  }, []);

  const getPerformanceMessage = () => {
    if (lessonResult.score >= 90) return "Excellent! Perfect work! 🎉";
    if (lessonResult.score >= 80) return "Great job! You're doing amazing! 👍";
    if (lessonResult.score >= 70) return "Good work! Keep practicing! 💪";
    return "Nice try! Review and try again! 📚";
  };

  const getPerformanceColor = () => {
    if (lessonResult.score >= 90) return "#48bb78";
    if (lessonResult.score >= 80) return "#38a169";
    if (lessonResult.score >= 70) return "#2f855a";
    return "#e53e3e";
  };

  return (
    <div className="lesson-completion">
      <LevelUpModal 
        show={showLevelUp} 
        onClose={() => setShowLevelUp(false)}
        newLevel={currentLevel}
      />
      
      <div className="completion-header">
        <div className="completion-icon">🎓</div>
        <h2>Lesson Complete!</h2>
        <p className="performance-message" style={{ color: getPerformanceColor() }}>
          {getPerformanceMessage()}
        </p>
      </div>

      <div className="results-grid">
        <div className="result-card">
          <div className="result-value" style={{ color: getPerformanceColor() }}>
            {lessonResult.score}%
          </div>
          <div className="result-label">Score</div>
        </div>

        <div className="result-card">
          <div className="result-value">+{lessonResult.xpEarned}</div>
          <div className="result-label">XP Earned</div>
        </div>

        <div className="result-card">
          <div className="result-value">{lessonResult.correctAnswers}/{lessonResult.totalQuestions}</div>
          <div className="result-label">Correct Answers</div>
        </div>

        <div className="result-card">
          <div className="result-value">{Math.round(lessonResult.timeSpent / 60)}m</div>
          <div className="result-label">Time Spent</div>
        </div>
      </div>

      {lessonResult.completed ? (
        <div className="success-message">
          <div className="success-icon">✅</div>
          <p>You've successfully completed this lesson!</p>
        </div>
      ) : (
        <div className="improvement-message">
          <div className="improvement-icon">💡</div>
          <p>You need 70% to pass. Review the material and try again!</p>
        </div>
      )}

      <div className="completion-actions">
        <button className="review-btn" onClick={onReview}>
          Review Mistakes
        </button>
        <button className="continue-btn" onClick={onContinue}>
          {lessonResult.completed ? 'Next Lesson' : 'Try Again'}
        </button>
      </div>

      <div className="encouragement">
        <p>💫 Every lesson brings you closer to fluency. Keep going!</p>
      </div>
    </div>
  );
};

