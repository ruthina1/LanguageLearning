import * as Profile from '../models/profileModel.js';

export const getProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    console.log('Getting profile for user ID:', userId);

    const profileData = await Profile.getUserProfile(userId);
    console.log('Profile data retrieved successfully');

    res.json({
      success: true,
      data: profileData
    });
  } catch (error) {
    console.error('Error in getProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile data',
      error: error.message
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const profileData = req.body;

    if (!profileData || Object.keys(profileData).length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No profile data provided'
      });
    }

    const result = await Profile.updateUserProfile(userId, profileData);

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateProfile:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update profile',
      error: error.message
    });
  }
};

export const updateGoals = async (req, res) => {
  try {
    const userId = req.user.id;
    const goalsData = req.body;

    if (!goalsData.daily_goal_minutes || !goalsData.weekly_goal_days) {
      return res.status(400).json({
        success: false,
        message: 'Daily goal minutes and weekly goal days are required'
      });
    }

    const result = await Profile.updateUserGoals(userId, goalsData);

    res.json({
      success: true,
      message: 'Goals updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateGoals:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update goals',
      error: error.message
    });
  }
};