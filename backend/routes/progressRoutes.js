import express from 'express';
import { getUserProgress, updateUserProgress } from '../controllers/progressController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.get('/:userId', verifyToken, getUserProgress);
router.post('/update', verifyToken, updateUserProgress);

export default router;
