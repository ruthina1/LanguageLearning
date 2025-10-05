import React, { useState } from 'react';
import { communityAPI } from '../../services/api';
import './CreatePostModal.css';

export default function CreatePostModal({ show, onClose }) {
  const [content, setContent] = useState('');
  const [type, setType] = useState('progress');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const postTypes = [
    { value: 'achievement', label: '🏆 Achievement', description: 'Share your accomplishments' },
    { value: 'progress', label: '📈 Progress', description: 'Show your learning journey' },
    { value: 'question', label: '❓ Question', description: 'Ask for help' },
    { value: 'tip', label: '💡 Tip', description: 'Share helpful advice' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    setIsSubmitting(true);
    try {
      console.log('Posting:', { content, type });
      const result = await communityAPI.createPost({ content, type });
      console.log('Result:', result);

      if (result?.success) {
        setContent('');
        setType('progress');
        onClose();
      } else {
        alert(result?.error || 'Failed to create post');
      }
    } catch (error) {
      console.error('Error creating post:', error.response?.data || error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="modal-overlay">
      <div className="create-post-modal">
        <div className="modal-header">
          <h2>Create a Post</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Post Type</label>
            <div className="type-options">
              {postTypes.map(postType => (
                <div
                  key={postType.value}
                  className={`type-option ${type === postType.value ? 'active' : ''}`}
                  onClick={() => setType(postType.value)}
                >
                  <div className="type-label">{postType.label}</div>
                  <div className="type-description">{postType.description}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>What would you like to share?</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Share your language learning experience..."
              rows={6}
              required
            />
          </div>

          <div className="form-actions">
            <button type="button" onClick={onClose} className="cancel-btn">
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting || !content.trim()} className="submit-btn">
              {isSubmitting ? 'Posting...' : 'Post to Community'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
