import pool from "../config/db.js";

export const getDashboardData = async (req, res) => {
  try {
    const { userId } = req.params;

    // User info
    const [[user]] = await pool.query(
      "SELECT id, username, display_name, level, total_xp, current_streak FROM users WHERE id = ?",
      [userId]
    );

    // Weak areas
    const [weakAreas] = await pool.query(
      "SELECT skill, accuracy, improvement FROM weak_areas WHERE user_id = ?",
      [userId]
    );

    // Recent activities
    const [activities] = await pool.query(
      "SELECT activity_type AS type, title, created_at, xp_earned AS xp FROM activities WHERE user_id = ? ORDER BY created_at DESC LIMIT 5",
      [userId]
    );

    // Weekly progress
    const [weekly] = await pool.query(
      "SELECT DAYNAME(progress_date) AS day, xp_earned AS xp, lessons_completed AS lessons FROM weekly_progress WHERE user_id = ? ORDER BY progress_date ASC LIMIT 7",
      [userId]
    );

    res.json({
      currentLevel: user.level,
      totalXP: user.total_xp,
      streak: user.current_streak,
      accuracy: 85, // TODO: compute from activities or user_progress
      weeklyProgress: weekly,
      weakAreas,
      recentActivity: activities
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
