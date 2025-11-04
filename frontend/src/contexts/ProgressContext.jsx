import React, { createContext, useContext, useState, useEffect } from 'react';
import { dashboardAPI } from '../services/api';

const ProgressContext = createContext();

export const ProgressProvider = ({ children }) => {
  const [progress, setProgress] = useState({
    current_level: 1,
    total_xp: 0,
    current_streak: 0,
    accuracy: 0,
    lessons_completed: 0,
    weeklyProgress: [],
    weakAreas: []
  });
  const [activities, setActivities] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await dashboardAPI.getDashboardData();
      
      if (response.data.success) {
        const dashboardData = response.data.data;
        setProgress(dashboardData.progress);
        setActivities(dashboardData.activities || []);
      }
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const updateProgress = async (progressData) => {
    try {
      const response = await dashboardAPI.updateProgress(progressData);
      
      if (response.data.success) {
        // Update local state
        setProgress(prev => ({
          ...prev,
          total_xp: prev.total_xp + (progressData.xpEarned || 0),
          accuracy: progressData.accuracy || prev.accuracy
        }));

        // Add to activities
        setActivities(prev => [progressData, ...prev].slice(0, 10));
        
        return { success: true };
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, error: error.message };
    }
  };

  

  const refreshData = () => {
    fetchDashboardData();
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const value = {
    progress,
    activities,
    isLoading,
    error,
    updateProgress,
    refreshData
  };

  return (
    <ProgressContext.Provider value={value}>
      {children}
    </ProgressContext.Provider>
  );
};

export const useProgress = () => {
  const context = useContext(ProgressContext);
  
  if (!context) {
    throw new Error('useProgress must be used within a ProgressProvider');
  }
  
  return context;
};

export default ProgressContext;