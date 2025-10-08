import express from 'express';
import {
  getProfile,
  updateProfile,
  updateGoals
} from '../controllers/profileController.js';
import { protect } from '../middleware/profm.js';

const router = express.Router();


router.use(protect);
router.get('/', getProfile);
router.put('/', updateProfile);
router.put('/goals', updateGoals);

export default router;