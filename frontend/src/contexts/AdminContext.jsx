import React, { createContext, useState, useContext, useEffect } from 'react';
import { adminAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AdminContext = createContext(undefined);

export const AdminProvider = ({ children }) => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminStats, setAdminStats] = useState(null);
  const [users, setUsers] = useState([]);
  const [lessonsAnalytics, setLessonsAnalytics] = useState([]);
  const [aiFeedbackLogs, setAIFeedbackLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      checkAdminStatus();
    }
  }, [user]);

  const checkAdminStatus = async () => {
    try {
      const adminStatus = await adminAPI.checkAdminStatus();
      setIsAdmin(adminStatus.isAdmin);

      if (adminStatus.isAdmin) {
        await loadAdminData();
      }
    } catch (error) {
      console.error('Error checking admin status:', error);
      setIsAdmin(false);
    } finally {
      setIsLoading(false);
    }
  };

  const loadAdminData = async () => {
    try {
      setIsLoading(true);
      const [stats, usersData, analytics, feedbackLogs] = await Promise.all([
        adminAPI.getDashboardStats(),
        adminAPI.getUsers(),
        adminAPI.getLessonsAnalytics(),
        adminAPI.getAIFeedbackLogs()
      ]);

      setAdminStats(stats);
      setUsers(usersData.users);
      setLessonsAnalytics(analytics.lessons);
      setAIFeedbackLogs(feedbackLogs.logs);
    } catch (error) {
      console.error('Error loading admin data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserStatus = async (userId, status) => {
    try {
      await adminAPI.updateUserStatus(userId, status);
      setUsers(prev =>
        prev.map(user =>
          user.id === userId ? { ...user, status } : user
        )
      );
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  };

  const createLesson = async (lessonData) => {
    try {
      const newLesson = await adminAPI.createLesson(lessonData);
      return newLesson;
    } catch (error) {
      console.error('Error creating lesson:', error);
      throw error;
    }
  };

  const updateLesson = async (lessonId, updates) => {
    try {
      const updatedLesson = await adminAPI.updateLesson(lessonId, updates);
      return updatedLesson;
    } catch (error) {
      console.error('Error updating lesson:', error);
      throw error;
    }
  };

  const getAIFeedbackAccuracy = async () => {
    try {
      const accuracy = await adminAPI.getAIFeedbackAccuracy();
      return accuracy;
    } catch (error) {
      console.error('Error getting AI feedback accuracy:', error);
      throw error;
    }
  };

  const exportData = async (type) => {
    try {
      await adminAPI.exportData(type);
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  };

  return (
    <AdminContext.Provider value={{
      isAdmin,
      adminStats,
      users,
      lessonsAnalytics,
      aiFeedbackLogs,
      isLoading,
      loadAdminData,
      updateUserStatus,
      createLesson,
      updateLesson,
      getAIFeedbackAccuracy,
      exportData
    }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (context === undefined) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};

