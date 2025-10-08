// backend/controllers/activitiesController.js
import pool from '../config/db.js';

// Example function to match frontend API
export const getActivities = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const [rows] = await pool.query('SELECT * FROM activities LIMIT ?', [limit]);
    res.json({ activities: rows });
  } catch (error) {
    console.error('Error fetching activities:', error);
    res.status(500).json({ error: error.message });
  }
};
