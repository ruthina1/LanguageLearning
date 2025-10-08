import PronunciationModel from '../models/PronunciationModel.js';
import AIProgressModel from '../models/AIProgressModel.js';
import AIService from '../services/aiService.js';

class PronunciationController {
  async evaluatePronunciation(req, res) {
    try {

      const { spokenText, targetText, audioUrl = null } = req.body;
      

      if (!spokenText || !targetText) {
        return res.status(400).json({ 
          success: false, 
          message: 'Spoken text and target text are required' 
        });
      }

      const evaluation = await AIService.evaluatePronunciation(spokenText, targetText);
      
      if (!evaluation.accuracy_score && !evaluation.accuracyScore) {
        throw new Error('AI evaluation missing accuracy score');
      }

      const accuracyScore = evaluation.accuracy_score || evaluation.accuracyScore;
      
      const evaluationId = await PronunciationModel.createPronunciationEvaluation(
        req.user.id,
        targetText,
        spokenText,
        accuracyScore,
        audioUrl
      );
      
      const feedback = evaluation.feedback || {};
      await PronunciationModel.createPronunciationFeedback(
        evaluationId,
        feedback.strengths || [],
        feedback.areasToImprove || [],
        feedback.practiceExercises || []
      );
      
      const mispronouncedWords = evaluation.mispronounced_words || evaluation.mispronouncedWords || [];
      if (mispronouncedWords.length > 0) {
        for (const word of mispronouncedWords) {
          await PronunciationModel.createMispronouncedWord(
            evaluationId,
            word.word,
            word.issue_description || word.issue,
            word.correction_tip || word.tip,
            word.phonetic_spelling || word.phonetic
          );
        }
      }
      
      await AIProgressModel.incrementAISessionCount(req.user.id, 'pronunciation');
      await AIProgressModel.addAIXP(req.user.id, 8);
      
      const fullEvaluation = await PronunciationModel.getPronunciationEvaluationWithDetails(evaluationId, req.user.id);
      
      res.json({
        success: true,
        data: fullEvaluation
      });
      
    } catch (error) {

      const evaluation = await AIService.evaluatePronunciation(req.body.spokenText, req.body.targetText);
      
      res.json({
        success: true,
        data: {
          ...evaluation,
          _fallback: true,
          message: 'Evaluation completed but not saved to database'
        }
      });
    }
  }

  async getPronunciationEvaluations(req, res) {
    try {
      const evaluations = await PronunciationModel.getUserPronunciationEvaluations(req.user.id);
      res.json({ 
        success: true, 
        data: evaluations 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch pronunciation evaluations' 
      });
    }
  }

  async getPronunciationEvaluation(req, res) {
    try {
      const { evaluationId } = req.params;
      
      const evaluation = await PronunciationModel.getPronunciationEvaluationWithDetails(evaluationId, req.user.id);
      
      if (!evaluation) {
        return res.status(404).json({ 
          success: false, 
          message: 'Evaluation not found' 
        });
      }
      
      res.json({ 
        success: true, 
        data: evaluation 
      });
    } catch (error) {
      res.status(500).json({ 
        success: false, 
        message: 'Failed to fetch pronunciation evaluation' 
      });
    }
  }
}

export default new PronunciationController();