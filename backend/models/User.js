import pool from '../config/db.js';
import bcrypt from "bcryptjs";

export default class User {
  // Create new user
  static async create(userData) {
    const { 
      email, 
      username, 
      password, 
      native_language, 
      target_language 
    } = userData;
    
    // Hash password
    const saltRounds = 10;
    const password_hash = await bcrypt.hash(password, saltRounds);
    
    const [result] = await pool.execute(
      `INSERT INTO users (email, username, password_hash, display_name, native_language, target_language) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [email, username, password_hash, username, native_language, target_language]
    );
    
    return this.findById(result.insertId);
  }

  // Find user by ID
  static async findById(id) {
    const [rows] = await pool.execute(
      `SELECT id, email, username, display_name, avatar_url, level, total_xp, 
              current_streak, best_streak, native_language, target_language, created_at 
       FROM users WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Find user by email
  static async findByEmail(email) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Find user by username
  static async findByUsername(username) {
    const [rows] = await pool.execute(
      'SELECT * FROM users WHERE username = ?',
      [username]
    );
    return rows[0];
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Update user progress
  static async updateProgress(userId, progressData) {
    const { xpEarned, level, streak } = progressData;
    
    const [result] = await pool.execute(
      `UPDATE users 
       SET total_xp = total_xp + ?, level = ?, current_streak = ?,
           best_streak = GREATEST(best_streak, ?), updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [xpEarned, level, streak, streak, userId]
    );
    
    return result.affectedRows > 0;
  }

  // Update user languages
  static async updateLanguages(userId, native_language, target_language) {
    const [result] = await pool.execute(
      `UPDATE users 
       SET native_language = ?, target_language = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [native_language, target_language, userId]
    );
    
    return result.affectedRows > 0;
  }

  // Get user language preferences
  static async getLanguages(userId) {
    const [rows] = await pool.execute(
      'SELECT native_language, target_language FROM users WHERE id = ?',
      [userId]
    );
    return rows[0];
  }
}