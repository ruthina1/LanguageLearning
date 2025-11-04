import React, { useState } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaShare, FaEllipsisH } from 'react-icons/fa';
import './PostCard.css';

export default function PostCard({ post, currentUser, onLike, onAddComment }) {
  const [isLiked, setIsLiked] = useState(currentUser ? post.likes?.includes(currentUser.id) : false);
  const [likeCount, setLikeCount] = useState(post.likes?.length || 0);
  const [showComments, setShowComments] = useState(false);
  const [newComment, setNewComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);

  const handleLike = async () => {
    if (!currentUser?.id) {
      alert('Please log in to like posts');
      return;
    }
    
    const result = await onLike(post.id);
    if (!result.success) {
      alert(result.error || 'Failed to like post');
      return;
    }

    // Toggle like state locally for immediate UI feedback
    setIsLiked(prev => !prev);
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1);
  };

  const handleAddComment = async () => {
    if (!currentUser) return;
    if (onAddComment && newComment.trim()) {
      const result = await onAddComment(post.id, newComment.trim());
      if (result.success) {
        const tempComment = {
          id: Date.now(),
          userName: currentUser.name || "You",
          userAvatar: currentUser.avatar || "👤",
          content: newComment.trim(),
          timestamp: new Date().toISOString(),
        };
        setComments(prev => [...prev, tempComment]);
        setNewComment('');
        setShowComments(true);
      }
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);
    if (diffInHours < 1) return `${Math.floor(diffInHours * 60)}m ago`;
    if (diffInHours < 24) return `${Math.floor(diffInHours)}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getPostIcon = (type) => {
    switch(type){
      case 'achievement': return '🏆';
      case 'progress': return '📈';
      case 'question': return '❓';
      case 'tip': return '💡';
      default: return '📝';
    }
  };

  return (
    <div className="post-card">
      <div className="post-header">
        <div className="user-info">
          <div className="user-avatar">{post.userAvatar || '👤'}</div>
          <div className="user-details">
            <div className="user-name">{post.userName}</div>
            <div className="post-meta">
              <span className="post-time">{formatTime(post.timestamp)}</span>
              <span className="post-type">{getPostIcon(post.type)} {post.type}</span>
            </div>
          </div>
        </div>
        <button className="post-menu"><FaEllipsisH /></button>
      </div>

      <div className="post-content">
        <p>{post.content}</p>
        {post.relatedData && (
          <div className="post-related-data">
            {post.relatedData.course && <span className="data-item">Course: {post.relatedData.course}</span>}
            {post.relatedData.xpEarned && <span className="data-item">XP: +{post.relatedData.xpEarned}</span>}
            {post.relatedData.streak && <span className="data-item">Streak: {post.relatedData.streak} days</span>}
            {post.relatedData.wordsLearned && <span className="data-item">Words: {post.relatedData.wordsLearned}</span>}
          </div>
        )}
      </div>

      <div className="post-stats">
        <span>{likeCount} likes</span>
        <span>{comments.length} comments</span>
      </div>

      <div className="post-actions">
        <button
          className="action-btn"
          onClick={handleLike}
          disabled={!currentUser}
          style={{ color: isLiked ? 'red' : 'inherit', transition: 'color 0.3s ease' }}
        >
          {isLiked ? <FaHeart /> : <FaRegHeart />} Like
        </button>
        <button className="action-btn" onClick={() => currentUser && setShowComments(!showComments)} disabled={!currentUser}>
          <FaComment /> Comment
        </button>
        <button className="action-btn"><FaShare /> Share</button>
      </div>

      {showComments && (
        <div className="comments-section">
          <div className="comments-list">
            {comments.map(comment => (
              <div key={comment.id} className="comment">
                <div className="comment-avatar">{comment.userAvatar || '👤'}</div>
                <div className="comment-content">
                  <div className="comment-header">
                    <span className="comment-user">{comment.userName}</span>
                    <span className="comment-time">{formatTime(comment.timestamp)}</span>
                  </div>
                  <p>{comment.content}</p>
                </div>
              </div>
            ))}
          </div>
          {currentUser && (
            <div className="add-comment">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Write a comment..."
                className="comment-input"
                onKeyPress={(e) => { if(e.key==='Enter') handleAddComment(); }}
              />
              <button onClick={handleAddComment} disabled={!newComment.trim()} className="comment-btn">Post</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
