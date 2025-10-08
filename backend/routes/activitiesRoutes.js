import express from 'express';
import { getActivities } from '../controllers/activitiesController.js';
import { verifyToken } from '../controllers/authController.js';

const router = express.Router();

router.get('/', verifyToken, getActivities);

export default router;
