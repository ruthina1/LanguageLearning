// frontend/src/components/Social/ChallengeCard.jsx
import React from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { useAuth } from '../../contexts/AuthContext';
import './ChallengeCard.css';

export default function ChallengeCard ({ challenge }) {
  const { joinChallenge } = useSocial();
  const { user } = useAuth();

  const isParticipating = challenge.participants.some(p => p.user.id === user?.id);
  const daysLeft = Math.ceil((new Date(challenge.endDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24));
  const progress = isParticipating ? 
    challenge.participants.find(p => p.user.id === user?.id)?.progress || 0 : 0;

  const getChallengeIcon = () => {
    switch (challenge.type) {
      case 'xp': return '⭐';
      case 'lessons': return '📚';
      case 'streak': return '🔥';
      case 'accuracy': return '🎯';
      default: return '⚔️';
    }
  };

  const getProgressPercentage = () => {
    return Math.min((progress / challenge.target) * 100, 100);
  };

  const handleJoinChallenge = async () => {
    if (!user) return;
    await joinChallenge(challenge.id);
  };

  return (
    <div className="challenge-card">
      <div className="challenge-header">
        <div className="challenge-icon">{getChallengeIcon()}</div>
        <div className="challenge-info">
          <h3>{challenge.title}</h3>
          <p>{challenge.description}</p>
        </div>
        <div className="challenge-meta">
          <span className="days-left">{daysLeft}d left</span>
          <span className="participants">{challenge.participants.length} participants</span>
        </div>
      </div>

      <div className="challenge-progress">
        <div className="progress-bar">
          <div 
            className="progress-fill"
            style={{ width: `${getProgressPercentage()}%` }}
          ></div>
        </div>
        <div className="progress-text">
          {isParticipating ? (
            <span>{progress}/{challenge.target} {challenge.type}</span>
          ) : (
            <span>Target: {challenge.target} {challenge.type}</span>
          )}
        </div>
      </div>

      <div className="challenge-participants">
        <div className="participants-list">
          {challenge.participants.slice(0, 3).map(participant => (
            <div key={participant.user.id} className="participant">
              <div className="participant-avatar">
                {participant.user.avatar || '👤'}
              </div>
              <div className="participant-progress">
                <div 
                  className="mini-progress"
                  style={{ width: `${Math.min((participant.progress / challenge.target) * 100, 100)}%` }}
                ></div>
              </div>
            </div>
          ))}
          {challenge.participants.length > 3 && (
            <div className="more-participants">
              +{challenge.participants.length - 3} more
            </div>
          )}
        </div>
      </div>

      <div className="challenge-actions">
        {isParticipating ? (
          <button className="participating-btn" disabled>
            ✅ Participating
          </button>
        ) : (
          <button className="join-btn" onClick={handleJoinChallenge}>
            Join Challenge
          </button>
        )}
        
        {challenge.prize && (
          <div className="prize-info">
            🏅 Prize: {challenge.prize}
          </div>
        )}
      </div>
    </div>
  );
};
