import pool from '../config/db.js';

class CommunityModel {

  static async getAllPosts(userId) {
    const query = `
      SELECT 
        cp.*,
        COUNT(DISTINCT pl.id) as likes_count,
        COUNT(DISTINCT pc.id) as comments_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = ?) as user_liked
      FROM community_posts cp
      LEFT JOIN post_likes pl ON cp.id = pl.post_id
      LEFT JOIN post_comments pc ON cp.id = pc.post_id
      GROUP BY cp.id
      ORDER BY cp.created_at DESC
    `;

    const [posts] = await pool.execute(query, [userId]);

    for (let post of posts) {
      const [comments] = await pool.execute(`
        SELECT pc.*, u.name as user_name 
        FROM post_comments pc 
        JOIN users u ON pc.user_id = u.id 
        WHERE pc.post_id = ? 
        ORDER BY pc.created_at ASC
      `, [post.id]);
      
      post.comments = comments;
      
      const [likes] = await pool.execute(
        'SELECT user_id FROM post_likes WHERE post_id = ?',
        [post.id]
      );
      post.likes = likes.map(like => like.user_id);
    }

    return posts;
  }

  static async getPostsByType(userId, type) {
    const query = `
      SELECT 
        cp.*,
        COUNT(DISTINCT pl.id) as likes_count,
        COUNT(DISTINCT pc.id) as comments_count,
        EXISTS(SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = ?) as user_liked
      FROM community_posts cp
      LEFT JOIN post_likes pl ON cp.id = pl.post_id
      LEFT JOIN post_comments pc ON cp.id = pc.post_id
      WHERE cp.type = ?
      GROUP BY cp.id
      ORDER BY cp.created_at DESC
    `;

    const [posts] = await pool.execute(query, [userId, type]);

    for (let post of posts) {
      const [comments] = await pool.execute(`
        SELECT pc.*, u.name as user_name 
        FROM post_comments pc 
        JOIN users u ON pc.user_id = u.id 
        WHERE pc.post_id = ? 
        ORDER BY pc.created_at ASC
      `, [post.id]);
      
      post.comments = comments;
      
      const [likes] = await pool.execute(
        'SELECT user_id FROM post_likes WHERE post_id = ?',
        [post.id]
      );
      post.likes = likes.map(like => like.user_id);
    }

    return posts;
  }

  static async createPost(userId, userName, content, type, relatedData) {
    const query = `
      INSERT INTO community_posts (user_id, user_name, type, content, related_data) 
      VALUES (?, ?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      userId,
      userName,
      type,
      content,
      relatedData ? JSON.stringify(relatedData) : null
    ]);

    const [posts] = await pool.execute(`
      SELECT cp.*, 
             COUNT(DISTINCT pl.id) as likes_count,
             COUNT(DISTINCT pc.id) as comments_count,
             EXISTS(SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = ?) as user_liked
      FROM community_posts cp
      LEFT JOIN post_likes pl ON cp.id = pl.post_id
      LEFT JOIN post_comments pc ON cp.id = pc.post_id
      WHERE cp.id = ?
      GROUP BY cp.id
    `, [userId, result.insertId]);

    const newPost = posts[0];
    newPost.comments = [];
    newPost.likes = [];

    return newPost;
  }


  static async toggleLike(postId, userId) {

    const [existingLike] = await pool.execute(
      'SELECT id FROM post_likes WHERE post_id = ? AND user_id = ?',
      [postId, userId]
    );

    if (existingLike.length > 0) {

      await pool.execute(
        'DELETE FROM post_likes WHERE post_id = ? AND user_id = ?',
        [postId, userId]
      );
      return { liked: false };
    } else {

      await pool.execute(
        'INSERT INTO post_likes (post_id, user_id) VALUES (?, ?)',
        [postId, userId]
      );
      return { liked: true };
    }
  }


  static async addComment(postId, userId, userName, content) {
    const query = `
      INSERT INTO post_comments (post_id, user_id, user_name, content) 
      VALUES (?, ?, ?, ?)
    `;

    const [result] = await pool.execute(query, [
      postId,
      userId,
      userName,
      content
    ]);

    const [comments] = await pool.execute(`
      SELECT pc.*, u.name as user_name 
      FROM post_comments pc 
      JOIN users u ON pc.user_id = u.id 
      WHERE pc.id = ?
    `, [result.insertId]);

    return comments[0];
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