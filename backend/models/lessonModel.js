import pool from '../config/db.js';

export const getAllLessons = async () => {
  const [rows] = await pool.query('SELECT * FROM lessons ORDER BY level, id');
  return rows;
};

export const getLessonsByLevel = async (level) => {
  const [rows] = await pool.query('SELECT * FROM lessons WHERE level = ? ORDER BY id', [level]);
  return rows;
};

export const getLessonById = async (id) => {
  const [rows] = await pool.query('SELECT * FROM lessons WHERE id = ?', [id]);
  return rows[0];
};