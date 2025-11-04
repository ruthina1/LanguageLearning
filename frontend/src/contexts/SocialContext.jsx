import React, { createContext, useState, useContext, useEffect } from 'react';
import { communityAPI } from '../services/api';
import { useAuth } from './AuthContext';

const SocialContext = createContext();

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) throw new Error('useSocial must be used within a SocialProvider');
  return context;
};

export const SocialProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const [communityPosts, setCommunityPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
  const [userStats, setUserStats] = useState({ totalPosts: 0, totalComments: 0, totalLikes: 0 });


  const fetchPosts = async (type = 'all') => {
    try {
      setIsLoading(true);
      const result = await communityAPI.getPosts(type);
      if (result?.success) {
   
        setCommunityPosts(Array.isArray(result.posts) ? result.posts : []);
      } else {
        setCommunityPosts([]);
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err);
      setCommunityPosts([]);
    } finally {
      setIsLoading(false);
    }
  };


  const fetchStats = async () => {
    try {
      const result = await communityAPI.getStats();
      if (result?.success) {
        setStats(result.stats);
      } else {

        setStats({
          totalPosts: communityPosts.length,
          totalComments: communityPosts.reduce((acc, p) => acc + (p.comments_count || 0), 0),
          totalLikes: communityPosts.reduce((acc, p) => acc + (p.likes_count || 0), 0),
        });
      }
    } catch (err) {
      console.error('Error fetching stats:', err);
    }
  };


  const fetchUserStats = async () => {
    if (!userId) {
      setUserStats({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
      return;
    }
    try {
      const result = await communityAPI.getUserStats();
      if (result?.success) {
        setUserStats(result.stats);
      } else {
   
        const userPosts = communityPosts.filter(post => post.user_id === userId);
        const userComments = communityPosts.flatMap(post =>
          post.comments?.filter(c => c.user_id === userId) || []
        );
        const userLikes = communityPosts.flatMap(post =>
          post.likes?.filter(likeUserId => likeUserId === userId) || []
        );
        setUserStats({
          totalPosts: userPosts.length,
          totalComments: userComments.length,
          totalLikes: userLikes.length
        });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setUserStats({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
    }
  };

  const createPost = async (content, type = 'progress', relatedData = {}) => {
    try {
      const result = await communityAPI.createPost({ content, type, relatedData });
      if (result?.success) {
        setCommunityPosts(prev => [result.post, ...prev]);
        await fetchStats();
        await fetchUserStats();
        return { success: true };
      } else {
        return { success: false, error: result.error || 'Failed to create post' };
      }
    } catch (err) {
      console.error('Error creating post:', err);
      return { success: false, error: err.message };
    }
  };

  const likePost = async (postId) => {
    try {
      const result = await communityAPI.likePost(postId);
      if (result?.success) {
        setCommunityPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  likes_count: result.liked
                    ? (post.likes_count || 0) + 1
                    : Math.max(0, (post.likes_count || 0) - 1),
                  user_liked: result.liked
                }
              : post
          )
        );
        await fetchUserStats();
        return { success: true, liked: result.liked };
      }
    } catch (err) {
      console.error('Error liking post:', err);
      return { success: false, error: err.message };
    }
  };


  const addComment = async (postId, content) => {
    try {
      const result = await communityAPI.addComment(postId, content);
      if (result?.success) {
        setCommunityPosts(prev =>
          prev.map(post =>
            post.id === postId
              ? {
                  ...post,
                  comments: [...(post.comments || []), result.comment],
                  comments_count: (post.comments_count || 0) + 1
                }
              : post
          )
        );
        await fetchUserStats();
        return { success: true };
      }
      return { success: false, error: result.error || 'Failed to add comment' };
    } catch (err) {
      console.error('Error adding comment:', err);
      return { success: false, error: err.message };
    }
  };


  useEffect(() => {
    fetchPosts();
    fetchStats();
    fetchUserStats();
  }, [userId]);

  const value = {
    communityPosts,
    isLoading,
    stats,
    userStats,
    fetchPosts,
    fetchStats,
    fetchUserStats,
    createPost,
    likePost,
    addComment
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
};
