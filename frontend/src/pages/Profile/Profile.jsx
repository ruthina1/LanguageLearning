import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { profileAPI } from '../../services/api';
import { FaEdit, FaSave, FaTimes } from 'react-icons/fa';
import './Profile.css';

export default function Profile() {
  const { user, loading: userLoading } = useUser();
  const [profileData, setProfileData] = useState(null);
  const [editField, setEditField] = useState(null);
  const [tempValue, setTempValue] = useState('');
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showPrivacyPolicy, setShowPrivacyPolicy] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!userLoading && user) {
      fetchProfileData();
    }
  }, [user, userLoading]);

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await profileAPI.getProfile();
      setProfileData(response.data.data);
    } catch (err) {
      console.error('Error fetching profile:', err);
      setError('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (field, value) => {
    setEditField(field);
    setTempValue(value || '');
  };

  const handleCancelEdit = () => {
    setEditField(null);
    setTempValue('');
  };

  const handleSaveEdit = async () => {
    try {
      setError(null);
      setMessage('');
      
      const updateData = { [editField]: tempValue };
      const response = await profileAPI.updateProfile(updateData);
      
      setProfileData({ ...profileData, ...updateData });
      setEditField(null);
      setTempValue('');
      setMessage('Profile updated successfully!');
      

      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Failed to update field:', error);
      setError('Failed to update profile. Please try again.');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit();
    } else if (e.key === 'Escape') {
      handleCancelEdit();
    }
  };

  if (userLoading || (loading && !profileData)) {
    return (
      <div className="profile-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error && !profileData) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p>{error}</p>
          <button onClick={fetchProfileData}>Retry</button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="error-container">
          <p>Please log in to view your profile.</p>
        </div>
      </div>
    );
  }

  const {
    username,
    email,
    display_name,
    avatar_url,
    native_language,
    target_language,
    created_at,
    daily_goal_minutes,
    weekly_goal_days,
  } = profileData || {};

  return (
    <div className="profile-page">
      
      {message && (
        <div className="message success">
          {message}
        </div>
      )}
      {error && (
        <div className="message error">
          {error}
        </div>
      )}

      <div className="profile-header">
        <div className="profile-avatar">
          {avatar_url ? (
            <img src={avatar_url} alt="Avatar" className="avatar-img" />
          ) : (
            <div className="avatar-placeholder">👤</div>
          )}
        </div>
        <div className="profile-info">
          <h1>{display_name || username}</h1>
          <p>Language Learner</p>
        </div>
      </div>

      <div className="profile-content">

        <div className="profile-section">
          <h2>Account Information</h2>
          <div className="info-grid">

            <div className="info-item">
              <label>Username:</label>
              <span>{username}</span>
            </div>

            <div className="info-item">
              <label>Email:</label>
              <span>{email}</span>
            </div>

            <div className="info-item editable">
              <label>Display Name:</label>
              {editField === 'display_name' ? (
                <div className="edit-container">
                  <input
                    type="text"
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                    onKeyDown={handleKeyPress}
                    autoFocus
                  />
                  <FaSave className="icon save" onClick={handleSaveEdit} />
                  <FaTimes className="icon cancel" onClick={handleCancelEdit} />
                </div>
              ) : (
                <>
                  <span>{display_name || 'Not set'}</span>
                  <FaEdit
                    className="icon edit"
                    onClick={() => handleEditClick('display_name', display_name)}
                  />
                </>
              )}
            </div>

            <div className="info-item editable">
              <label>Native Language:</label>
              {editField === 'native_language' ? (
                <div className="edit-container">
                  <select
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                  </select>
                  <FaSave className="icon save" onClick={handleSaveEdit} />
                  <FaTimes className="icon cancel" onClick={handleCancelEdit} />
                </div>
              ) : (
                <>
                  <span>
                    {native_language === 'am' ? 'Amharic' : 
                     native_language === 'en' ? 'English' : 'Not set'}
                  </span>
                  <FaEdit
                    className="icon edit"
                    onClick={() => handleEditClick('native_language', native_language)}
                  />
                </>
              )}
            </div>

            <div className="info-item editable">
              <label>Target Language:</label>
              {editField === 'target_language' ? (
                <div className="edit-container">
                  <select
                    value={tempValue}
                    onChange={(e) => setTempValue(e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                  </select>
                  <FaSave className="icon save" onClick={handleSaveEdit} />
                  <FaTimes className="icon cancel" onClick={handleCancelEdit} />
                </div>
              ) : (
                <>
                  <span>
                    {target_language === 'en' ? 'English' : 
                     target_language === 'am' ? 'Amharic' : 'Not set'}
                  </span>
                  <FaEdit
                    className="icon edit"
                    onClick={() => handleEditClick('target_language', target_language)}
                  />
                </>
              )}
            </div>

            <div className="info-item">
              <label>Member Since:</label>
              <span>{created_at ? new Date(created_at).toLocaleDateString() : 'N/A'}</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Learning Goals</h2>
          <div className="goals-list">
            <div className="goal-item">
              <span>Daily Goal:</span>
              <span>{daily_goal_minutes || 30} minutes</span>
            </div>
            <div className="goal-item">
              <span>Weekly Goal:</span>
              <span>{weekly_goal_days || 5} days</span>
            </div>
          </div>
        </div>

        <div className="profile-section">
          <h2>Settings</h2>
          <div className="settings-list">
            <button className="setting-btn" onClick={() => setShowPasswordModal(true)}>
              Change Password
            </button>
            <button className="setting-btn" onClick={() => setShowPrivacyPolicy(true)}>
              Privacy Policy
            </button>
          </div>
        </div>
      </div>

      {showPasswordModal && (
        <PasswordModal onClose={() => setShowPasswordModal(false)} />
      )}

      {showPrivacyPolicy && (
        <PrivacyModal onClose={() => setShowPrivacyPolicy(false)} />
      )}
    </div>
  );
}

const PasswordModal = ({ onClose }) => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    alert('Password change functionality to be implemented');
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <input 
            type="password" 
            placeholder="Current Password"
            value={formData.currentPassword}
            onChange={(e) => setFormData({...formData, currentPassword: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="New Password"
            value={formData.newPassword}
            onChange={(e) => setFormData({...formData, newPassword: e.target.value})}
            required
          />
          <input 
            type="password" 
            placeholder="Confirm New Password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
            required
          />
          <div className="modal-actions">
            <button type="button" onClick={onClose}>Close</button>
            <button type="submit">Update Password</button>
          </div>
        </form>
      </div>
    </div>
  );
};

const PrivacyModal = ({ onClose }) => {
  return (
    <div className="modal-overlay">
      <div className="modal privacy">
        <h2>Privacy Policy</h2>
        <div className="privacy-content">
          <p>
            We value your privacy. Your data is securely stored and never shared
            without your consent. This platform collects minimal information
            necessary for learning analytics and personalized progress tracking.
          </p>
          <p>
            You can delete your account or data anytime by contacting support.
          </p>
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
};