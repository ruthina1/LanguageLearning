import express from 'express';
import {
  getDashboardData,
  updateProgress,
  getPracticeStats,
  getSuggestedLessons
} from '../controllers/dashboardController.js';
import { authenticateToken } from '../middleware/dashm.js';

const router = express.Router();


router.get('/',authenticateToken, getDashboardData);
router.post('/progress',authenticateToken, updateProgress);
router.get('/practice-stats', authenticateToken, getPracticeStats);
router.get('/suggested-lessons', authenticateToken, getSuggestedLessons);

export default router;