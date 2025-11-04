import React, { useState, useEffect } from 'react';
import { useSocial } from '../../contexts/SocialContext';
import { useAuth } from '../../contexts/AuthContext';
import PostCard from './PostCard';
import CreatePostModal from './CreatePostModal';
import SuccessPopup from './SuccessPopup';
import { FaEdit, FaStar, FaTrophy, FaChartLine, FaQuestion, FaLightbulb, FaCheck, FaTimes } from 'react-icons/fa';
import './CommunityFeed.css';

export default function CommunityFeed() {
  const { 
    communityPosts, 
    createPost, 
    isLoading, 
    stats, 
    fetchPosts,
    likePost,
    userStats, 
    addComment 
  } = useSocial();
  
  const { currentUser: user } = useAuth(); 
  
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [postType, setPostType] = useState('all');
  const [showPopup, setShowPopup] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState('');

  const filteredPosts = postType === 'all' 
    ? communityPosts 
    : communityPosts.filter(post => post.type === postType);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        setError('');
        await fetchPosts();
      } catch (err) {
        setError('Failed to load posts. Please try again.');
        console.error('Error loading posts:', err);
      }
    };
    
    loadPosts();
  }, []);


  useEffect(() => {
    if (postType && postType !== 'all') {
      fetchPosts(postType);
    }
  }, [postType]);


  const handleCreatePost = async (content, type, relatedData) => {
    try {
      setError('');
      const result = await createPost(content, type, relatedData);

      if (result.success) {
        setShowCreateModal(false);
        setShowPopup(true);

        
        setTimeout(async () => {
          setShowPopup(false);
          setIsRefreshing(true);
          try {
            
            if (postType && postType !== 'all') {
              await fetchPosts(postType);
            } else {
              await fetchPosts();
            }
          } catch (err) {
            setError('Failed to refresh posts');
          } finally {
            setIsRefreshing(false);
          }
        }, 1500);
      } else {
        setError(result.error || "Failed to create post");
      }
    } catch (err) {
      setError("An unexpected error occurred");
      console.error('Error creating post:', err);
    }
  };

  const handleTypeChange = (type) => {
    setPostType(type);
  };


  if (isLoading && communityPosts.length === 0 && !isRefreshing) {
    return (
      <div className="community-feed">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading community posts...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="community-feed">

      {isRefreshing && (
        <div className="refreshing-overlay">
          <div className="loading-spinner"></div>
          <p>Refreshing posts...</p>
        </div>
      )}

   
      {error && (
        <div className="error-message">
          <p>{error}</p>
          <button onClick={() => window.location.reload()}>Retry</button>
        </div>
      )}

      <div className="feed-header">
        <div className="header-content">
          <h1>Community Feed</h1>
          <p>Connect with fellow language learners</p>
        </div>

        {user?.id ? (
          <button 
            className="create-post-btn"
            onClick={() => setShowCreateModal(true)}
            disabled={isRefreshing}
          >
            <FaEdit /> Create Post
          </button>
        ) : (
          <p className="login-prompt">Log in to create a post</p>
        )}
      </div>

      <div className="feed-filters">
        {['all','achievement','progress','question','tip'].map(type => (
          <button 
            key={type}
            className={`filter-btn ${postType === type ? 'active' : ''}`}
            onClick={() => handleTypeChange(type)}
            disabled={isLoading || isRefreshing}
          >
            {type === 'all' && <><FaStar /> All Posts</>}
            {type === 'achievement' && <><FaTrophy /> Achievements</>}
            {type === 'progress' && <><FaChartLine /> Progress</>}
            {type === 'question' && <><FaQuestion /> Questions</>}
            {type === 'tip' && <><FaLightbulb /> Tips</>}
          </button>
        ))}
      </div>

      <div className="feed-content">
        <div className="posts-container">
          {filteredPosts.length === 0 ? (
            <div className="no-posts">
              <div className="no-posts-icon">📝</div>
              <h3>No posts found</h3>
              <p>
                {postType === 'all' 
                  ? "Be the first to share your language learning journey!" 
                  : `No ${postType} posts yet. Be the first to share!`
                }
              </p>
              {user?.id && (
                <button 
                  className="create-first-post"
                  onClick={() => setShowCreateModal(true)}
                >
                  Create First Post
                </button>
              )}
            </div>
          ) : (
            filteredPosts.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onLike={likePost}
                onAddComment={addComment}
                currentUser={user} 
              />
            ))
          )}
        </div>

        <div className="feed-sidebar">
          <div className="community-stats">
            <h3>{user?.id ? 'Your Stats' : 'Community Stats'}</h3>
            <div className="stat-item">
              <span className="stat-value">
                {user?.id ? userStats.totalPosts : stats.totalPosts}
              </span>
              <span className="stat-label">
                {user?.id ? 'Your Posts' : 'Total Posts'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {user?.id ? userStats.totalComments : stats.totalComments}
              </span>
              <span className="stat-label">
                {user?.id ? 'Your Comments' : 'Total Comments'}
              </span>
            </div>
            <div className="stat-item">
              <span className="stat-value">
                {user?.id ? userStats.totalLikes : stats.totalLikes}
              </span>
              <span className="stat-label">
                {user?.id ? 'Your Likes' : 'Total Likes'}
              </span>
            </div>
          </div>

          <div className="community-guidelines">
            <h3>Community Guidelines</h3>
            <ul>
              <li><FaCheck /> Be respectful and supportive</li>
              <li><FaCheck /> Share learning tips and resources</li>
              <li><FaCheck /> Celebrate each other's progress</li>
              <li><FaCheck /> Ask thoughtful questions</li>
              <li><FaTimes /> No spam or self-promotion</li>
              <li><FaTimes /> No offensive language</li>
            </ul>
          </div>
        </div>
      </div>

      {user?.id && (
        <CreatePostModal
          show={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onSubmit={handleCreatePost}
          isLoading={isRefreshing}
        />
      )}

      {showPopup && (
        <SuccessPopup 
          message="Post created successfully!" 
          onClose={() => setShowPopup(false)} 
        />
      )}
    </div>
  );
}