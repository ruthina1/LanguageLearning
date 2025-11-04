// frontend/src/components/Social/CreateChallengeModal.jsx
import React, { useState } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import './CreateChallengeModal.css';

export default function CreateChallengeModal ({ show, onClose }) {
  const { createChallenge, friends } = useSocial();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'xp',
    target: 100,
    duration: 7,
    prize: '',
    isPublic: true,
    participants: []
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const challengeTypes = [
    { value: 'xp', label: '⭐ XP Challenge', description: 'Earn the most XP' },
    { value: 'lessons', label: '📚 Lessons Challenge', description: 'Complete the most lessons' },
    { value: 'streak', label: '🔥 Streak Challenge', description: 'Maintain the longest streak' },
    { value: 'accuracy', label: '🎯 Accuracy Challenge', description: 'Achieve the highest accuracy' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await createChallenge(formData);
      setFormData({
        title: '',
        description: '',
        type: 'xp',
        target: 100,
        duration: 7,
        prize: '',
        isPublic: true,
        participants: []
      });
      onClose();
    } catch (error) {
      console.error('Error creating challenge:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFriendToggle = (friendId) => {
    setFormData(prev => ({
      ...prev,
      participants: prev.participants.includes(friendId)
        ? prev.participants.filter(id => id !== friendId)
        : [...prev.participants, friendId]
    }));
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="create-challenge-modal">
        <div className="modal-header">
          <h2>Create a Challenge</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit} className="challenge-form">
          <div className="form-group">
            <label>Challenge Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData({...formData, title: e.target.value})}
              placeholder="e.g., Weekly XP Race"
              required
            />
          </div>

          <div className="form-group">
            <label>Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({...formData, description: e.target.value})}
              placeholder="Describe your challenge..."
              rows={3}
            />
          </div>

          <div className="form-group">
            <label>Challenge Type</label>
            <div className="type-options">
              {challengeTypes.map(type => (
                <div
                  key={type.value}
                  className={`type-option ${formData.type === type.value ? 'active' : ''}`}
                  onClick={() => setFormData({...formData, type: type.value})}
                >
                  <div className="type-icon">{type.label.split(' ')[0]}</div>
                  <div className="type-info">
                    <div className="type-label">{type.label.split(' ').slice(1).join(' ')}</div>
                    <div className="type-desc">{type.description}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Target</label>
              <input
                type="number"
                value={formData.target}
                onChange={(e) => setFormData({...formData, target: parseInt(e.target.value)})}
                min="10"
                max="10000"
                required
              />
            </div>

            <div className="form-group">
              <label>Duration (days)</label>
              <select
                value={formData.duration}
                onChange={(e) => setFormData({...formData, duration: parseInt(e.target.value)})}
              >
                <option value={1}>1 day</option>
                <option value={7}>7 days</option>
                <option value={14}>14 days</option>
                <option value={30}>30 days</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Prize (optional)</label>
            <input
              type="text"
              value={formData.prize}
              onChange={(e) => setFormData({...formData, prize: e.target.value})}
              placeholder="e.g., Bragging rights, Study session, etc."
            />
          </div>

          <div className="form-group">
            <label>Invite Friends</label>
            <div className="friends-list">
              {friends.map(friend => (
                <div key={friend.id} className="friend-checkbox">
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.participants.includes(friend.id)}
                      onChange={() => handleFriendToggle(friend.id)}
                    />
                    <span className="friend-avatar">{friend.avatar || '👤'}</span>
                    <span className="friend-name">
                      {friend.profile?.displayName || friend.username}
                    </span>
                  </label>
                </div>
              ))}
            </div>
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="create-btn">
              {isSubmitting ? 'Creating...' : 'Create Challenge'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

