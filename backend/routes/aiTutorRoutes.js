import { Router } from 'express';
const router = Router();

import verifyToken from '../middleware/jwtMiddleware.js';
import AITutorController from '../controllers/AITutorController.js';
import GrammarController from '../controllers/grammarController.js';
import PronunciationController from '../controllers/pronunciationController.js';
import AIProgressController from '../controllers/aiProgressController.js';


// Conversation routes
router.get('/conversations', verifyToken, AITutorController.getUserConversations);
router.post('/conversations', verifyToken, AITutorController.createConversation);
router.get('/conversations/:conversationId/messages', verifyToken, AITutorController.getMessages);
router.post('/conversations/message', verifyToken, AITutorController.addMessage);
router.delete('/conversations/:conversationId', verifyToken, AITutorController.clearConversation);

// Grammar routes
router.post('/grammar/analyze', verifyToken, GrammarController.analyzeGrammar);
router.get('/grammar/analyses', verifyToken, GrammarController.getGrammarAnalyses);
router.get('/grammar/analyses/:analysisId', verifyToken, GrammarController.getGrammarAnalysis);

// Pronunciation routes
router.post('/pronunciation/evaluate', verifyToken, PronunciationController.evaluatePronunciation);
router.get('/pronunciation/evaluations', verifyToken, PronunciationController.getPronunciationEvaluations);
router.get('/pronunciation/evaluations/:evaluationId', verifyToken, PronunciationController.getPronunciationEvaluation);

// AI Progress routes
router.get('/progress', verifyToken, AIProgressController.getAIProgress);
router.get('/progress/stats', verifyToken, AIProgressController.getAIStats);
router.post('/progress/streak', verifyToken, AIProgressController.updateAIStreak);

export default router;