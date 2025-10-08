// backend/controllers/grammarController.js
import GrammarModel from '../models/GrammarModel.js';
import AIProgressModel from '../models/AIProgressModel.js';
import AIService from '../services/aiService.js';

class GrammarController {
  async analyzeGrammar(req, res) {
    try {
      const { text } = req.body;
      
      if (!text || text.trim().length === 0) {
        return res.status(400).json({ error: 'Text is required' });
      }
      
      const analysis = await AIService.analyzeGrammar(text);
      
      const analysisId = await GrammarModel.createGrammarAnalysis(
        req.user.id,
        text,
        analysis.correctedText || text,
        analysis.isPerfect || false,
        analysis.overallFeedback?.english || 'No feedback available',
        analysis.overallFeedback?.amharic || 'ምንም አስተያየት አልተገኘም'
      );
      
      if (analysis.errors && analysis.errors.length > 0) {
        for (const error of analysis.errors) {
          const errorId = await GrammarModel.createGrammarError(
            analysisId,
            error.original || error.original_text || '',
            error.correction || error.correction_text || '',
            error.severity || 'medium',
            error.explanationEnglish || error.explanation_english || 'No explanation',
            error.explanationAmharic || error.explanation_amharic || 'ማብራሪያ የለም'
          );
          
          if (error.examples && error.examples.length > 0) {
            for (const example of error.examples) {
              await GrammarModel.createGrammarErrorExample(errorId, example);
            }
          }
        }
      }
      
      if (analysis.improvementTips && analysis.improvementTips.length > 0) {
        for (const tip of analysis.improvementTips) {
          await GrammarModel.createImprovementTip(
            analysisId, 
            tip.tip || tip.tip_text || 'Practice more',
            tip.category || 'general'
          );
        }
      }

      await AIProgressModel.incrementAISessionCount(req.user.id, 'grammar');
      await AIProgressModel.addAIXP(req.user.id, 10);
      

      const fullAnalysis = await GrammarModel.getGrammarAnalysisWithDetails(analysisId, req.user.id);
      
      res.json(fullAnalysis);
      
    } catch (error) {
      res.status(500).json({ error: 'Failed to analyze grammar' });
    }
  }

  async getGrammarAnalyses(req, res) {
    try {
      const analyses = await GrammarModel.getUserGrammarAnalyses(req.user.id);
      res.json(analyses);
    } catch (error) {
      console.error('Get grammar analyses error:', error);
      res.status(500).json({ error: 'Failed to fetch grammar analyses' });
    }
  }

  async getGrammarAnalysis(req, res) {
    try {
      const { analysisId } = req.params;
      const analysis = await GrammarModel.getGrammarAnalysisWithDetails(analysisId, req.user.id);
      
      if (!analysis) {
        return res.status(404).json({ error: 'Analysis not found' });
      }
      
      res.json(analysis);
    } catch (error) {
      console.error('Get grammar analysis error:', error);
      res.status(500).json({ error: 'Failed to fetch grammar analysis' });
    }
  }
}

export default new GrammarController();