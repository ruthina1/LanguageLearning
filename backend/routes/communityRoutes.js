import express from 'express';
import { 
  getPosts, 
  createPost, 
  likePost, 
  addComment,
  getStats,
  getUserStats  
} from '../controllers/communityController.js';
import { authenticateToken } from '../middleware/chatm.js';

const router = express.Router();

router.get('/', authenticateToken, getPosts);
router.get('/stats', authenticateToken, getStats);
router.get('/user-stats', authenticateToken, getUserStats);
router.post('/', authenticateToken, createPost);
router.post('/:postId/like', authenticateToken, likePost);
router.post('/:postId/comment', authenticateToken, addComment);

export default router;
