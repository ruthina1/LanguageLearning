import express from 'express';
import { getLessons,getLessonById  } from '../controllers/lessonController.js';

const router = express.Router();

router.get('/', getLessons);
router.get('/:id', getLessonById)

export default router;