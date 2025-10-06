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

    const [weakAreas] = await pool.query(
      `SELECT skill, 
              AVG(accuracy) as avg_accuracy,
              COUNT(*) as practice_count
       FROM user_activities 
       WHERE user_id = ? 
       GROUP BY skill 
       HAVING practice_count > 0
       ORDER BY avg_accuracy ASC 
       LIMIT 3`,
      [userId]
    );

    const weakSkills = weakAreas.map(area => area.skill);
    
    let suggestedLessonsQuery = `
      SELECT l.* 
      FROM lessons l 
      WHERE l.is_active = true 
        AND l.level <= ?
    `;
    
    const queryParams = [currentLevel + 1];
    
    if (weakSkills.length > 0) {
      suggestedLessonsQuery += ` AND (l.skill IN (${weakSkills.map(() => '?').join(',')}) OR l.difficulty = 'beginner')`;
      queryParams.push(...weakSkills);
    }
    
    suggestedLessonsQuery += ` ORDER BY 
      CASE WHEN l.skill IN (${weakSkills.map(() => '?').join(',')}) THEN 0 ELSE 1 END,
      l.level ASC, 
      l.difficulty ASC 
      LIMIT 5`;
    
    queryParams.push(...weakSkills);
    
    const [suggestedLessons] = await pool.query(suggestedLessonsQuery, queryParams);

    return {
      progress: {
        current_level: currentLevel,
        lessons_completed: completedLessons[0]?.lessons_completed || 0,
        total_xp: totalXp 
      },
      activities: recentActivities,
      weeklyProgress: weeklyProgress,
      weakAreas: weakAreas,
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