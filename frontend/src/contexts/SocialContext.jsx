import React, { createContext, useState, useContext, useEffect } from 'react';
import { communityAPI } from '../services/api';
import { useAuth } from './AuthContext'; 

const SocialContext = createContext();

export const useSocial = () => {
  const context = useContext(SocialContext);
  if (!context) {
    throw new Error('useSocial must be used within a SocialProvider');
  }
  return context;
};

export const SocialProvider = ({ children }) => {
  const [communityPosts, setCommunityPosts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
  const [userStats, setUserStats] = useState({ totalPosts: 0, totalComments: 0, totalLikes: 0 });


  const { currentUser } = useAuth();
  const userId = currentUser?.id;

  const fetchPosts = async (type = null) => {
    try {
      setIsLoading(true);
      const posts = await communityAPI.getPosts(type);
      setCommunityPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      console.error("Failed to fetch posts:", err);
      setCommunityPosts([]);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUserStats = async () => {
    try {
      const result = await communityAPI.getUserStats();
      if (result?.success) {
        setUserStats(result.stats);
      } else if (userId) {
        const userPosts = communityPosts.filter(post => post.user_id === userId);
        const userComments = communityPosts.flatMap(post => 
          post.comments?.filter(comment => comment.user_id === userId) || []
        );
        const userLikes = communityPosts.flatMap(post => 
          post.likes?.filter(like => like === userId) || []
        );

        setUserStats({
          totalPosts: userPosts.length,
          totalComments: userComments.length,
          totalLikes: userLikes.length
        });
      } else {

        setUserStats({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
      }
    } catch (err) {
      console.error('Error fetching user stats:', err);
      setUserStats({ totalPosts: 0, totalComments: 0, totalLikes: 0 });
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
      setStats({
        totalPosts: communityPosts.length,
        totalComments: communityPosts.reduce((acc, p) => acc + (p.comments_count || 0), 0),
        totalLikes: communityPosts.reduce((acc, p) => acc + (p.likes_count || 0), 0),
      });
    }
  };

  const createPost = async (content, type, relatedData = {}) => {
    try {
      const result = await communityAPI.createPost({ content, type, relatedData });
      if (result.success) {
        setCommunityPosts(prev => [result.post, ...prev]);
        await fetchUserStats(); 
        await fetchStats(); 
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
    
    if (result.success) {
      
      setCommunityPosts(prev => {
        const updatedPosts = prev.map(post => {
          if (post.id === postId) {
            const currentLikesCount = post.likes_count || 0;
            const newLikesCount = result.liked ? currentLikesCount + 1 : Math.max(0, currentLikesCount - 1);
            return {
              ...post,
              likes_count: newLikesCount,
              user_liked: result.liked
            };
          }
          return post;
        });
        
        return updatedPosts;
      });
      
      await fetchUserStats();
      return { success: true, liked: result.liked };
    }
  } catch (err) {
    return { success: false, error: err.message };
  }
};
  const addComment = async (postId, content) => {
    try {
      const result = await communityAPI.addComment(postId, content);
      if (result.success) {
        setCommunityPosts(prev =>
          prev.map(post => {
            if (post.id === postId) {
              return {
                ...post,
                comments: [...(post.comments || []), result.comment],
                comments_count: (post.comments_count || 0) + 1
              };
            }
            return post;
          })
        );
        await fetchUserStats(); 
      }
      return result;
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
    createPost,
    likePost,
    addComment,
    refreshStats: fetchStats,
    refreshUserStats: fetchUserStats
  };

  return <SocialContext.Provider value={value}>{children}</SocialContext.Provider>;
};