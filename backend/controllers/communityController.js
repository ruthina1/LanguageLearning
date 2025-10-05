import CommunityModel from '../models/CommunityModel.js';
import pool from '../config/db.js';

export const getPosts = async (req, res) => {
  try {
    const userId = req.user?.userId || null; 
    const { type } = req.query;

    let posts;
    if (type && type !== 'all') {
      posts = await CommunityModel.getPosts(userId, type);
    } else {
      posts = await CommunityModel.getPosts(userId);
    }

    res.json(posts);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const createPost = async (req, res) => {
  try {
    const { content, type, relatedData } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required to create posts' });
    }

    if (!content || !type) {
      return res.status(400).json({ success: false, error: 'Content and type are required' });
    }

    const post = await CommunityModel.createPost(userId, content, type, relatedData);

    res.json({
      success: true,
      post: post
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await CommunityModel.getStats();
    res.json({
      success: true,
      stats: stats
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const result = await CommunityModel.toggleLike(postId, userId);

    res.json({ 
      success: true, 
      liked: result.liked, 
      userId: userId,
      postId: postId
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!content) {
      return res.status(400).json({ success: false, error: 'Comment content is required' });
    }

    const comment = await CommunityModel.addComment(postId, userId, content);
    res.json({ success: true, comment: comment });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};


export const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.userId;
    
    if (!userId) {
      return res.json({
        success: true,
        stats: {
          totalPosts: 0,
          totalComments: 0,
          totalLikes: 0
        }
      });
    }

    const [userPosts] = await pool.execute(
      'SELECT COUNT(*) as count FROM community_posts WHERE user_id = ?',
      [userId]
    );

    const [userComments] = await pool.execute(
      'SELECT COUNT(*) as count FROM post_comments WHERE user_id = ?',
      [userId]
    );

    const [userLikes] = await pool.execute(
      'SELECT COUNT(*) as count FROM post_likes WHERE user_id = ?',
      [userId]
    );

    res.json({
      success: true,
      stats: {
        totalPosts: userPosts[0].count,
        totalComments: userComments[0].count,
        totalLikes: userLikes[0].count
      }
    });
  } catch (err) {
    console.error('Error fetching user stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};