import * as Lesson from '../models/lessonModel.js';

// GET /api/lessons
export const getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.getAllLessons(); // must return array of lessons
    const courseData = [];
    const levels = [...new Set(lessons.map(l => l.level))];

    levels.forEach(level => {
      courseData.push({
        level,
        title: `Level ${level} Lessons`,
        skills: lessons
          .filter(l => l.level === level)
          .map(l => ({ id: l.id, title: l.title })),
      });
    });

    res.json({ courseData }); // must return JSON
  } catch (err) {
    console.error('Error in getLessons:', err);
    res.status(500).json({ message: 'Failed to fetch lessons' }); // always send valid JSON
  }
};

export const getLessonById = async (req, res) => {
  try {
    const lesson = await Lesson.getLessonById(req.params.id);
    if (!lesson) return res.status(404).json({ message: 'Lesson not found' });
    res.json({ lesson });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch lesson' });
  }
};