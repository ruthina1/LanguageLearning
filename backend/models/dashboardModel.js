import pool from '../config/db.js';

export const getUserDashboardData = async (userId) => {
  try {
    const [completedLessons] = await pool.query(
      `SELECT COUNT(DISTINCT lesson_id) as lessons_completed
       FROM user_activities 
       WHERE user_id = ? AND activity_type = 'lesson' AND lesson_id IS NOT NULL`,
      [userId]
    );

    const [totalXpResult] = await pool.query(
      `SELECT IFNULL(SUM(xp_earned), 0) as total_xp
       FROM user_activities 
       WHERE user_id = ?`,
      [userId]
    );

    const totalXp = totalXpResult[0]?.total_xp || 0;
    const currentLevel = Math.floor(totalXp / 1000) + 1;

    const [recentActivities] = await pool.query(
      `SELECT activity_type, skill, xp_earned, duration, accuracy, created_at 
       FROM user_activities 
       WHERE user_id = ? 
       ORDER BY created_at DESC 
       LIMIT 10`,
      [userId]
    );

    const [weeklyProgress] = await pool.query(
      `SELECT DATE(created_at) as date, 
              SUM(xp_earned) as daily_xp,
              COUNT(*) as activities_count,
              AVG(accuracy) as avg_accuracy
       FROM user_activities 
       WHERE user_id = ? AND created_at >= DATE_SUB(NOW(), INTERVAL 7 DAY)
       GROUP BY DATE(created_at)
       ORDER BY date`,
      [userId]
    );

    const [suggestedLessons] = await pool.query(
      `SELECT l.* 
       FROM lessons l
       WHERE l.is_active = true
         AND l.level <= ?
       ORDER BY l.level ASC, l.difficulty ASC
       LIMIT 5`,
      [currentLevel + 1]
    );

    return {
      progress: {
        current_level: currentLevel,
        lessons_completed: completedLessons[0]?.lessons_completed || 0,
        total_xp: totalXp
      },
      activities: recentActivities,
      weeklyProgress: weeklyProgress,
      suggestedLessons: suggestedLessons
    };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    throw error;
  }
};

export const updateUserProgress = async (userId, progressData) => {
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    await connection.query(
      `INSERT INTO user_activities 
       (user_id, activity_type, skill, xp_earned, duration, accuracy, lesson_id) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        userId,
        progressData.activityType,
        progressData.skill,
        progressData.xpEarned,
        progressData.duration,
        progressData.accuracy,
        progressData.lessonId || null
      ]
    );

    await connection.commit();

    return { success: true, message: 'Progress updated successfully' };
  } catch (error) {
    await connection.rollback();
    console.error('Error updating user progress:', error);
    throw error;
  } finally {
    connection.release();
  }
};

export const getFocusedPracticeStats = async (userId) => {
  try {
    const [practiceStats] = await pool.query(
      `SELECT skill, 
              COUNT(*) as sessions,
              SUM(duration) as total_time,
              AVG(accuracy) as avg_accuracy,
              SUM(xp_earned) as total_xp
       FROM user_activities 
       WHERE user_id = ? AND activity_type = 'practice'
       GROUP BY skill`,
      [userId]
    );

    return practiceStats;
  } catch (error) {
    console.error('Error fetching practice stats:', error);
    throw error;
  }
};
