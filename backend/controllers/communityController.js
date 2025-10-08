import CommunityModel from '../models/CommunityModel.js';
import pool from '../config/db.js';

export const getPosts = async (req, res) => {
  try {
    const posts = await CommunityModel.getAllPosts();
    res.json({ success: true, posts });
  } catch (error) {
    console.error('Error fetching posts:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch posts' });
  }
};

export const createPost = async (req, res) => {
  try {
    const { content, type, relatedData } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) 
      return res.status(401).json({ success: false, error: 'Authentication required' });

    if (!content || !type) 
      return res.status(400).json({ success: false, error: 'Content and type are required' });

    const [users] = await pool.execute(
      'SELECT username, avatar_url FROM users WHERE id = ?', 
      [userId]
    );
    const user = users[0];

    if (!user) 
      return res.status(404).json({ success: false, error: 'User not found' });

    const post = await CommunityModel.createPost(
      userId,
      user.username,
      content,
      type,
      relatedData,
      user.avatar_url || '👤'
    );

    res.json({ success: true, post });
  } catch (err) {
    console.error('Error in createPost:', err);
    res.status(500).json({ success: false, error: 'Post creation failed: ' + err.message });
  }
};


export const likePost = async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    const result = await CommunityModel.toggleLike(postId, userId);
    res.json({ success: true, liked: result.liked, userId, postId });
  } catch (err) {
    console.error('Error liking post:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const addComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { content } = req.body;
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'Authentication required' });
    }

    if (!content) {
      return res.status(400).json({ success: false, error: 'Comment content is required' });
    }


    const [users] = await pool.execute('SELECT username FROM users WHERE id = ?', [userId]);
    const userName = users[0]?.username || 'Anonymous';

    const comment = await CommunityModel.addComment(postId, userId, userName, content);
    res.json({ success: true, comment });
  } catch (error) {
    console.error('Error adding comment:', error);
    res.status(500).json({ success: false, message: 'Failed to add comment' });
  }
};

export const getStats = async (req, res) => {
  try {
    const stats = await CommunityModel.getStats();
    res.json({ success: true, stats });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ success: false, error: err.message });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const userId = req.user?.id || req.user?.userId;

    if (!userId) {
      return res.json({ 
        success: true, 
        stats: { totalPosts: 0, totalComments: 0, totalLikes: 0 } 
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