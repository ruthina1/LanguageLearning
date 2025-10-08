import pool from '../config/db.js';

class MessageModel {
  async createMessage(conversationId, text, sender, amharicTranslation = null, pronunciationTips = null, grammarCorrections = null) {
    const [result] = await pool.execute(
      'INSERT INTO messages (conversation_id, text, sender, amharic_translation, pronunciation_tips, grammar_corrections) VALUES (?, ?, ?, ?, ?, ?)',
      [conversationId, text, sender, amharicTranslation, pronunciationTips, grammarCorrections]
    );
    
    const [messages] = await pool.execute(
      'SELECT * FROM messages WHERE id = ?',
      [result.insertId]
    );
    
    return messages[0];
  }

  async getConversationMessages(conversationId) {
    const [messages] = await pool.execute(
      'SELECT * FROM messages WHERE conversation_id = ? ORDER BY created_at ASC',
      [conversationId]
    );
    return messages;
  }

  async deleteConversationMessages(conversationId) {
    const [result] = await pool.execute(
      'DELETE FROM messages WHERE conversation_id = ?',
      [conversationId]
    );
    return result.affectedRows;
  }
}

export default new MessageModel();
