import pool from '../config/db.js';

class ConversationModel {
  async createConversation(userId, title = 'New Conversation') {
    const [result] = await pool.execute(
      'INSERT INTO conversations (user_id, title) VALUES (?, ?)',
      [userId, title]
    );
    return result.insertId;
  }

  async getUserConversations(userId) {
    const [conversations] = await pool.execute(
      `SELECT c.*, 
              (SELECT text FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message,
              (SELECT created_at FROM messages WHERE conversation_id = c.id ORDER BY created_at DESC LIMIT 1) as last_message_time
       FROM conversations c 
       WHERE user_id = ? 
       ORDER BY updated_at DESC`,
      [userId]
    );
    return conversations;
  }

  async getConversationWithMessages(conversationId, userId) {
    const [conversations] = await pool.execute(
      'SELECT * FROM conversations WHERE id = ? AND user_id = ?',
      [conversationId, userId]
    );
    
    if (conversations.length === 0) return null;

    const [messages] = await pool.execute(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );

    return {
      ...conversations[0],
      messages
    };
  }

  async deleteConversation(conversationId, userId) {
    const [result] = await pool.execute(
      'DELETE FROM conversations WHERE id = ? AND user_id = ?',
      [conversationId, userId]
    );
    return result.affectedRows > 0;
  }

  async updateConversationTitle(conversationId, userId, title) {
    const [result] = await pool.execute(
      'UPDATE conversations SET title = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND user_id = ?',
      [title, conversationId, userId]
    );
    return result.affectedRows > 0;
  }
}

export default new ConversationModel();
