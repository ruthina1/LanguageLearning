import React, { createContext, useState, useContext, useEffect } from 'react';
import { gamificationAPI } from '../services/api';
import { useAuth } from './AuthContext';

const GamificationContext = createContext(undefined);

export const GamificationProvider = ({ children }) => {
  const [achievements, setAchievements] = useState([]);
  const [leaderboard, setLeaderboard] = useState([]);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [totalXP, setTotalXP] = useState(0);
  const [currentLevel, setCurrentLevel] = useState(1);
  const [nextLevelXP, setNextLevelXP] = useState(100);
  const [levelProgress, setLevelProgress] = useState(0);
  const [showLevelUp, setShowLevelUp] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      loadGamificationData();
    }
  }, [user]);

  const loadGamificationData = async () => {
    try {
      setIsLoading(true);
      const [achievementsData, leaderboardData, userStats] = await Promise.all([
        gamificationAPI.getAchievements(),
        gamificationAPI.getLeaderboard(),
        gamificationAPI.getUserStats()
      ]);

      setAchievements(achievementsData.achievements);
      setLeaderboard(leaderboardData);
      setCurrentStreak(userStats.streak);
      setTotalXP(userStats.xp);
      setCurrentLevel(userStats.level);

      const nextXP = calculateNextLevelXP(userStats.level);
      setNextLevelXP(nextXP);
      setLevelProgress((userStats.xp / nextXP) * 100);
    } catch (error) {
      console.error('Error loading gamification data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const calculateNextLevelXP = (level) => Math.pow(level, 2) * 100;

  const checkForNewAchievements = async (activityType, data) => {
    try {
      const newAchievements = await gamificationAPI.checkAchievements(activityType, data);
      if (newAchievements.length > 0) {
        setAchievements(prev => prev.map(ach => {
          const newAch = newAchievements.find(a => a.id === ach.id);
          return newAch ? { ...ach, ...newAch } : ach;
        }));

        newAchievements.forEach(achievement => {
          if (achievement.earned) {
            showAchievementNotification(achievement);
          }
        });
      }
    } catch (error) {
      console.error('Error checking achievements:', error);
    }
  };

  const addXP = async (amount, source) => {
    try {
      const response = await gamificationAPI.addXP(amount, source);
      setTotalXP(response.newXP);

      const newLevel = calculateLevel(response.newXP);
      if (newLevel > currentLevel) {
        setCurrentLevel(newLevel);
        setShowLevelUp(true);
      }

      const nextXP = calculateNextLevelXP(newLevel);
      setNextLevelXP(nextXP);
      setLevelProgress((response.newXP / nextXP) * 100);

      await checkForNewAchievements('xp_earned', { amount, total: response.newXP });
    } catch (error) {
      console.error('Error adding XP:', error);
    }
  };

  const updateStreak = async () => {
    try {
      const response = await gamificationAPI.updateStreak();
      setCurrentStreak(response.streak);
      await checkForNewAchievements('streak_updated', { streak: response.streak });
    } catch (error) {
      console.error('Error updating streak:', error);
    }
  };

  const refreshLeaderboard = async () => {
    try {
      const leaderboardData = await gamificationAPI.getLeaderboard();
      setLeaderboard(leaderboardData);
    } catch (error) {
      console.error('Error refreshing leaderboard:', error);
    }
  };

  const showAchievementNotification = (achievement) => {
    console.log('Achievement unlocked:', achievement.name);
    // In a real app, you'd use a toast library like react-toastify
  };

  const calculateLevel = (xp) => Math.floor(Math.sqrt(xp / 100)) + 1;

  const unlockedAchievements = achievements.filter(ach => ach.earned);

  return (
    <GamificationContext.Provider value={{
      achievements,
      leaderboard,
      currentStreak,
      totalXP,
      currentLevel,
      nextLevelXP,
      levelProgress,
      unlockedAchievements,
      isLoading,
      checkForNewAchievements,
      addXP,
      updateStreak,
      refreshLeaderboard,
      showLevelUp,
      setShowLevelUp
    }}>
      {children}
    </GamificationContext.Provider>
  );
};

export const useGamification = () => {
  const context = useContext(GamificationContext);
  if (context === undefined) {
    throw new Error('useGamification must be used within a GamificationProvider');
  }
  return context;
};
