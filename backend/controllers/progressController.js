import * as Progress from '../models/progressModel.js';

export const getUserProgress = async (req, res) => {
  try {
    const userId = req.params.userId;

    const progress = await Progress.getProgressByUserId(userId);

    if (!progress) {
      return res.json({ current_level: 1, lessons_completed: [] });
    }

    res.json({
      current_level: progress.current_level,
      lessons_completed: JSON.parse(progress.lessons_completed || '[]'),
    });
  } catch (err) {
    console.error('Error fetching progress:', err);
    res.status(500).json({ error: 'Failed to fetch progress' });
  }
};


export const updateUserProgress = async (req, res) => {
  try {
    const { user_id, current_level, lessons_completed } = req.body;

    const existing = await Progress.getProgressByUserId(user_id);

    if (existing) {
      await Progress.updateProgress(user_id, current_level, lessons_completed);
    } else {
      await Progress.createProgress(user_id, current_level, lessons_completed);
    }

    res.json({ success: true });
  } catch (err) {
    console.error('Error updating progress:', err);
    res.status(500).json({ error: 'Failed to update progress' });
  }
};
