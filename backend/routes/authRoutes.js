// backend/routes/authRoutes.js
import express from 'express';
import { register, login, getProfile, verifyToken } from '../controllers/authController.js';
import { verifyTokenController } from '../controllers/authController.js';



const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/profile', getProfile);
router.get('/verify', verifyToken, verifyTokenController);

export default router;