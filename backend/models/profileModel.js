import pool from '../config/db.js';

export const getUserProfile = async (userId) => {
  try {
    console.log('Fetching profile for user ID:', userId);

    const [users] = await pool.query(
      `SELECT id, email, username, display_name, avatar_url, 
              native_language, target_language, created_at 
       FROM users 
       WHERE id = ?`,
      [userId]
    );

    if (users.length === 0) {
      throw new Error(`User with ID ${userId} not found`);
    }

    const [goals] = await pool.query(
      `SELECT daily_goal_minutes, weekly_goal_days 
       FROM user_goals 
       WHERE user_id = ?`,
      [userId]
    );

    const userData = users[0];
    const goalsData = goals[0] || {};

    return {
      ...userData,
      daily_goal_minutes: goalsData.daily_goal_minutes,
      weekly_goal_days: goalsData.weekly_goal_days
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

export const updateUserProfile = async (userId, profileData) => {
  const connection = await pool.getConnection();
  
  try {
    await connection.beginTransaction();

    const allowedFields = ['display_name', 'avatar_url', 'native_language', 'target_language'];
    const updateFields = [];
    const updateValues = [];

    Object.keys(profileData).forEach(field => {
      if (allowedFields.includes(field) && profileData[field] !== undefined) {
        updateFields.push(`${field} = ?`);
        updateValues.push(profileData[field]);
      }
    });

    if (updateFields.length === 0) {
      throw new Error('No valid fields to update');
    }

    updateValues.push(userId);
    
    const [result] = await connection.query(
      `UPDATE users 
       SET ${updateFields.join(', ')}, updated_at = NOW()
       WHERE id = ?`,
      updateValues
    );

    await connection.commit();

    return await getUserProfile(userId);
  } catch (error) {
    await connection.rollback();
    console.error('Error updating user profile:', error);
    throw error;
  } finally {
    connection.release();
  }
};