// frontend/src/components/Social/FriendList.jsx
import React from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { FaUsers, FaComment, FaUserTimes, FaCircle } from 'react-icons/fa';
import './FriendList.css';

export default function FriendList ({ friends = [] }) {
  const { removeFriend } = useSocial();

  const handleRemoveFriend = async (friendId) => {
    if (window.confirm('Are you sure you want to remove this friend?')) {
      try {
        await removeFriend(friendId);
      } catch (err) {
        console.error('Failed to remove friend:', err);
        alert('Could not remove friend. Try again.');
      }
    }
  };

  if (friends.length === 0) {
    return (
      <div className="no-friends">
        <div className="no-friends-icon"><FaUsers /></div>
        <h4>No friends yet</h4>
        <p>Add friends to see their progress and learn together!</p>
      </div>
    );
  }

  return (
    <div className="friend-list">
      <h3>Your Friends ({friends.length})</h3>
      <div className="friends-grid">
        {friends.map(friend => (
          <div key={friend.id} className="friend-card">
            <div className="friend-info">
              <div className="friend-avatar">{friend.avatar || '👤'}</div>
              <div className="friend-details">
                <div className="friend-name">
                  {friend.profile?.displayName || friend.username}
                </div>
                <div className="friend-stats">
                  <span>Level {friend.progress?.level || 0}</span>
                  <span>{friend.progress?.xp || 0} XP</span>
                  <span>{friend.progress?.streak || 0} day streak</span>
                </div>
                <div className="friend-status">
                  <span className={`status-dot ${friend.isOnline ? 'online' : 'offline'}`}>
                    <FaCircle />
                  </span>
                  {friend.isOnline ? 'Online' : 'Last seen recently'}
                </div>
              </div>
            </div>
            <div className="friend-actions">
              <button className="message-btn"><FaComment /> Message</button>
              <button className="remove-btn" onClick={() => handleRemoveFriend(friend.id)}>
                <FaUserTimes /> Remove
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};