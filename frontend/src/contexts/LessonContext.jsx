// frontend/src/contexts/LessonContext.js
import React, { createContext, useState, useContext } from 'react';
import { lessonAPI } from '../services/api';

const LessonContext = createContext();

export const useLesson = () => {
  const context = useContext(LessonContext);
  if (!context) {
    throw new Error('useLesson must be used within a LessonProvider');
  }
  return context;
};

export const LessonProvider = ({ children }) => {
  const [currentLesson, setCurrentLesson] = useState(null);
  const [exercises, setExercises] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const loadLesson = async (lessonId) => {
    setIsLoading(true);
    try {
      const lessonData = await lessonAPI.getLesson(lessonId);
      setCurrentLesson(lessonData);
      setExercises(lessonData.exercises || []);
    } catch (error) {
      console.error('Error loading lesson:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const value = {
    currentLesson,
    exercises,
    isLoading,
    loadLesson,
    setCurrentLesson,
    setExercises
  };

  return (
    <LessonContext.Provider value={value}>
      {children}
    </LessonContext.Provider>
  );
};
