import pool from '../config/db.js';

class AIProgressModel {
  static async incrementAISessionCount(userId, sessionType) {
    try {

      await this.ensureUserProgress(userId);
      const [result] = await pool.execute(
        `UPDATE user_ai_progress 
         SET ${sessionType}_sessions = ${sessionType}_sessions + 1,
             total_ai_sessions = total_ai_sessions + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [userId]
      );

      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async addAIXP(userId, xpAmount) {
    try {
      await this.ensureUserProgress(userId);
      
      const [result] = await pool.execute(
        `UPDATE user_ai_progress 
         SET xp = xp + ?,
             level = FLOOR((xp + ?) / 100) + 1,
             updated_at = CURRENT_TIMESTAMP
         WHERE user_id = ?`,
        [xpAmount, xpAmount, userId]
      );
      
      return result.affectedRows > 0;
    } catch (error) {
      throw error;
    }
  }

  static async ensureUserProgress(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT id FROM user_ai_progress WHERE user_id = ?',
        [userId]
      );
      
      if (rows.length === 0) {
        await pool.execute(
          `INSERT INTO user_ai_progress 
           (user_id, level, xp, streak, grammar_sessions, pronunciation_sessions, chat_sessions, total_ai_sessions)
           VALUES (?, 1, 0, 0, 0, 0, 0, 0)`,
          [userId]
        );
      }
    } catch (error) {
      throw error;
    }
  }

  static async getUserAIProgress(userId) {
    try {
      const [rows] = await pool.execute(
        'SELECT * FROM user_ai_progress WHERE user_id = ?',
        [userId]
      );
      
      if (rows.length === 0) {
        await this.ensureUserProgress(userId);
        const [newRows] = await pool.execute(
          'SELECT * FROM user_ai_progress WHERE user_id = ?',
          [userId]
        );
        return newRows[0] || null;
      }
      
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
}

export default AIProgressModel;
