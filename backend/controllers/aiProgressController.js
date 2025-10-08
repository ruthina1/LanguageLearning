import AIProgressModel from '../models/AIProgressModel.js';

class AIProgressController {
  async getAIProgress(req, res) {
    try {
      const progress = await AIProgressModel.getUserAIProgress(req.user.id);
      res.json(progress);
    } catch (error) {
      console.error('Get AI progress error:', error);
      res.status(500).json({ error: 'Failed to fetch AI progress' });
    }
  }

  async updateAIStreak(req, res) {
    try {
      const streak = await AIProgressModel.updateAIStreak(req.user.id);
      res.json({ streak });
    } catch (error) {
      console.error('Update AI streak error:', error);
      res.status(500).json({ error: 'Failed to update AI streak' });
    }
  }

  async getAIStats(req, res) {
    try {
      const progress = await AIProgressModel.getUserAIProgress(req.user.id);
      
      const stats = {
        level: progress.level,
        xp: progress.xp,
        streak: progress.streak,
        sessions: {
          grammar: progress.grammar_sessions,
          pronunciation: progress.pronunciation_sessions,
          chat: progress.chat_sessions,
          total: progress.total_ai_sessions
        },
        nextLevelXP: (progress.level * 100) - progress.xp
      };
      
      res.json(stats);
    } catch (error) {
      console.error('Get AI stats error:', error);
      res.status(500).json({ error: 'Failed to fetch AI stats' });
    }
  }
}

export default new AIProgressController();
