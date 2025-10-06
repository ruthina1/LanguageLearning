import * as Dashboard from '../models/dashboardModel.js';

export const getDashboardData = async (req, res) => {
  try {
    const userId = req.user.id; 

    const dashboardData = await Dashboard.getUserDashboardData(userId);

    res.json({
      success: true,
      data: dashboardData
    });
  } catch (error) {
    console.error('Error in getDashboardData:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch dashboard data',
      error: error.message
    });
  }
};

export const updateProgress = async (req, res) => {
  try {
    const userId = req.user.id; 
    const progressData = req.body;

    if (!progressData.xpEarned || !progressData.activityType || !progressData.skill) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: xpEarned, activityType, skill'
      });
    }

    const result = await Dashboard.updateUserProgress(userId, progressData);

    res.json({
      success: true,
      message: 'Progress updated successfully',
      data: result
    });
  } catch (error) {
    console.error('Error in updateProgress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update progress',
      error: error.message
    });
  }
};

export const getPracticeStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const practiceStats = await Dashboard.getFocusedPracticeStats(userId);

    res.json({
      success: true,
      data: practiceStats
    });
  } catch (error) {
    console.error('Error in getPracticeStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch practice statistics',
      error: error.message
    });
  }
};

export const getSuggestedLessons = async (req, res) => {
  try {
    const userId = req.user.id;

    const dashboardData = await Dashboard.getUserDashboardData(userId);

    res.json({
      success: true,
      data: dashboardData.suggestedLessons
    });
  } catch (error) {
    console.error('Error in getSuggestedLessons:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch suggested lessons',
      error: error.message
    });
  }
};