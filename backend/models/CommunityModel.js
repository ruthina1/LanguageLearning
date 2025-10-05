import pool from '../config/db.js';

class CommunityModel {
  static async getPosts(userId, type = null) {
    try {
      const query = `
        SELECT 
          cp.*,
          COUNT(DISTINCT pl.id) AS likes_count,
          COUNT(DISTINCT pc.id) AS comments_count,
          EXISTS(SELECT 1 FROM post_likes WHERE post_id = cp.id AND user_id = ?) AS user_liked
        FROM community_posts cp
        LEFT JOIN post_likes pl ON cp.id = pl.post_id
        LEFT JOIN post_comments pc ON cp.id = pc.post_id
        ${type ? 'WHERE cp.type = ?' : ''}
        GROUP BY cp.id
        ORDER BY cp.created_at DESC
      `;

      const params = type ? [userId, type] : [userId];
      const [posts] = await pool.execute(query, params);

      if (posts.length === 0) return [];

      const postIds = posts.map(p => p.id);

      const [comments] = await pool.execute(`
        SELECT pc.*, u.display_name AS user_name 
        FROM post_comments pc
        JOIN users u ON pc.user_id = u.id
        WHERE pc.post_id IN (?)
        ORDER BY pc.created_at ASC
      `, [postIds]);

      const [likes] = await pool.execute(`
        SELECT post_id, user_id FROM post_likes
        WHERE post_id IN (?)
      `, [postIds]);

      posts.forEach(post => {
        post.comments = comments.filter(c => c.post_id === post.id);
        post.likes = likes.filter(l => l.post_id === post.id).map(l => l.user_id);
        post.user_liked = !!post.user_liked;
      });

      return posts;
    } catch (error) {
      console.error('Error in getPosts:', error);
      throw new Error('Failed to fetch posts.');
    }
  }

  static async createPost(userId, content, type, relatedData) {
    try {

      const [userRows] = await pool.execute(
        'SELECT id, display_name, avatar_url, level FROM users WHERE id = ?',
        [userId]
      );

      if (!userRows.length) {
        throw new Error('User not found');
      }

      const user = userRows[0];

      const query = `
        INSERT INTO community_posts (user_id, user_name, avatar_url, user_level, type, content, related_data) 
        VALUES (?, ?, ?, ?, ?, ?, ?)
      `;
      const [result] = await pool.execute(query, [
        userId,
        user.display_name,
        user.avatar_url || '👤',
        user.level,
        type,
        content,
        relatedData ? JSON.stringify(relatedData) : null
      ]);

      return {
        id: result.insertId,
        user_id: userId,
        user_name: user.display_name,
        avatar_url: user.avatar_url || '👤',
        user_level: user.level,
        type,
        content,
        related_data: relatedData || {},
        likes: [],
        comments: [],
        likes_count: 0,
        comments_count: 0,
        user_liked: false,
        created_at: new Date()
      };
    } catch (error) {
      console.error('Error in createPost:', error);
      throw new Error('Failed to create post.');
    }
  }

static async toggleLike(postId, userId) {
  try {
    
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
  } catch (error) {
    throw new Error('Failed to toggle like.');
  }
}
  static async addComment(postId, userId, content) {
    try {
      const [userRows] = await pool.execute(
        'SELECT display_name FROM users WHERE id = ?',
        [userId]
      );

      if (!userRows.length) {
        throw new Error('User not found');
      }

      const user = userRows[0];

      const [result] = await pool.execute(`
        INSERT INTO post_comments (post_id, user_id, user_name, content) 
        VALUES (?, ?, ?, ?)
      `, [postId, userId, user.display_name, content]);

      const [comments] = await pool.execute(`
        SELECT pc.*
        FROM post_comments pc
        WHERE pc.id = ?
      `, [result.insertId]);

      return comments[0] || null;
    } catch (error) {
      throw new Error('Failed to add comment.');
    }
  }

  static async getStats() {
    try {
      const [totalPosts] = await pool.execute('SELECT COUNT(*) AS count FROM community_posts');
      const [totalComments] = await pool.execute('SELECT COUNT(*) AS count FROM post_comments');
      const [totalLikes] = await pool.execute('SELECT COUNT(*) AS count FROM post_likes');

      return {
        totalPosts: totalPosts[0].count,
        totalComments: totalComments[0].count,
        totalLikes: totalLikes[0].count
      };
    } catch (error) {
      console.error('Error in getStats:', error);
      throw new Error('Failed to get community stats.');
    }
  }
}

export default CommunityModel;