import pool from '../config/db.js';

export const getProgressByUserId = async (userId) => {
  const [rows] = await pool.query(
    'SELECT * FROM user_progress WHERE user_id = ?',
    [userId]
  );
  return rows[0]; 
};

export const createProgress = async (userId, currentLevel = 1, lessonsCompleted = []) => {
  const lessonsStr = JSON.stringify(lessonsCompleted);
  const [result] = await pool.query(
    'INSERT INTO user_progress (user_id, current_level, lessons_completed) VALUES (?, ?, ?)',
    [userId, currentLevel, lessonsStr]
  );
  return result;
};

export const updateProgress = async (userId, currentLevel, lessonsCompleted) => {
  const lessonsStr = JSON.stringify(lessonsCompleted);
  const [result] = await pool.query(
    'UPDATE user_progress SET current_level = ?, lessons_completed = ? WHERE user_id = ?',
    [currentLevel, lessonsStr, userId]
  );
  return result;
};
