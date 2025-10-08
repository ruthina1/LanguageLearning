import pool from '../config/db.js';

class CommunityModel {
  static async getAllPosts() {
    try {
      const [posts] = await pool.execute(
        `SELECT * FROM community_posts ORDER BY created_at DESC`
      );
      return posts;
    } catch (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }
  }

  static async createPost(userId, userName, content, type = 'text', relatedData = null, avatarUrl = '👤') {
    try {
      console.log('Creating post with params:', { 
        userId, 
        userName, 
        content, 
        type, 
        relatedData, 
        avatarUrl, 
      });

      const query = `
        INSERT INTO community_posts 
        (user_id, user_name, avatar_url, type, content, related_data) 
        VALUES (?, ?, ?, ?, ?, ?)
      `;

      const params = [
        userId,
        userName || 'Anonymous',
        avatarUrl || '👤',
        type || 'text',
        content,
        relatedData ? JSON.stringify(relatedData) : null
      ];

      console.log('Final SQL parameters:', params);

      const [result] = await pool.execute(query, params);
      console.log('Post inserted with ID:', result.insertId);

      const [posts] = await pool.execute(
        `SELECT * FROM community_posts WHERE id = ?`,
        [result.insertId]
      );

      if (!posts[0]) throw new Error('Failed to retrieve created post');

      const newPost = posts[0];

      newPost.likes_count = 0;
      newPost.comments_count = 0;
      newPost.user_liked = false;
      newPost.comments = [];
      newPost.likes = [];

      console.log('Created post:', newPost);
      return newPost;
    } catch (err) {
      console.error('Error in createPost:', err);
      throw err;
    }
  }

  static async toggleLike(postId, userId) {
    const [existingLike] = await pool.execute(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLike.length > 0) {
      await pool.execute('DELETE FROM post_likes WHERE post_id = ? AND user_id = ?', [postId, userId]);
      return { liked: false };
    } else {
      await pool.execute('INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)', [postId, userId]);
      return { liked: true };
    }
  }

  static async addComment(postId, userId, userName, content) {
    try {
      const [result] = await pool.execute(
        `INSERT INTO post_comments (post_id, user_id, user_name, content)
         VALUES (?, ?, ?, ?)`,
        [postId, userId, userName, content]
      );
      return {
        id: result.insertId,
        post_id: postId,
        user_id: userId,
        user_name: userName,
        content,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  static async getStats() {
    const [totalPosts] = await pool.execute('SELECT COUNT(*) as count FROM community_posts');
    const [totalComments] = await pool.execute('SELECT COUNT(*) as count FROM post_comments');
    const [totalLikes] = await pool.execute('SELECT COUNT(*) as count FROM post_likes');

    return {
      totalPosts: totalPosts[0].count,
      totalComments: totalComments[0].count,
      totalLikes: totalLikes[0].count
    };
  }
}

export default CommunityModel;
