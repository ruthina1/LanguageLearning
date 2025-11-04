// frontend/src/pages/Gamification/Achievements.jsx
import React, { useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaTrophy, 
  FaMedal, 
  FaAward, 
  FaStar, 
  FaFire, 
  FaBook, 
  FaClock, 
  FaUsers, 
  FaChartLine,
  FaCheckCircle,
  FaLock,
  FaGem
} from 'react-icons/fa';
import './Achievements.css';
import Navbar from '../../components/Layout/Navbar';

// Mock data for testing
const mockAchievements = [
  {
    id: 'ach1',
    title: 'First Steps',
    description: 'Complete your first lesson',
    icon: 'FaStar',
    category: 'learning',
    points: 50,
    progress: { current: 1, target: 1 },
    unlocked: true,
    unlockedAt: '2024-01-10T14:30:00Z',
    rarity: 'common'
  },
  {
    id: 'ach2',
    title: 'Week Warrior',
    description: 'Maintain a 7-day streak',
    icon: 'FaFire',
    category: 'consistency',
    points: 100,
    progress: { current: 5, target: 7 },
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'ach3',
    title: 'Vocabulary Master',
    description: 'Learn 100 new words',
    icon: 'FaBook',
    category: 'vocabulary',
    points: 200,
    progress: { current: 75, target: 100 },
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ach4',
    title: 'Grammar Guru',
    description: 'Complete all grammar exercises',
    icon: 'FaAward',
    category: 'grammar',
    points: 300,
    progress: { current: 8, target: 15 },
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'ach5',
    title: 'Speed Demon',
    description: 'Complete 10 lessons with 90%+ accuracy',
    icon: 'FaClock',
    category: 'speed',
    points: 150,
    progress: { current: 7, target: 10 },
    unlocked: false,
    rarity: 'uncommon'
  },
  {
    id: 'ach6',
    title: 'Social Butterfly',
    description: 'Add 5 friends',
    icon: 'FaUsers',
    category: 'social',
    points: 100,
    progress: { current: 3, target: 5 },
    unlocked: false,
    rarity: 'common'
  },
  {
    id: 'ach7',
    title: 'Level Up!',
    description: 'Reach level 5',
    icon: 'FaChartLine',
    category: 'progression',
    points: 250,
    progress: { current: 4, target: 5 },
    unlocked: false,
    rarity: 'rare'
  },
  {
    id: 'ach8',
    title: 'Perfect Score',
    description: 'Get 100% on 5 different lessons',
    icon: 'FaTrophy',
    category: 'accuracy',
    points: 400,
    progress: { current: 2, target: 5 },
    unlocked: false,
    rarity: 'legendary'
  },
  {
    id: 'ach9',
    title: 'Marathon Runner',
    description: 'Maintain a 30-day streak',
    icon: 'FaFire',
    category: 'consistency',
    points: 500,
    progress: { current: 5, target: 30 },
    unlocked: false,
    rarity: 'epic'
  },
  {
    id: 'ach10',
    title: 'Polyglot in Training',
    description: 'Complete courses in 3 different categories',
    icon: 'FaGem',
    category: 'versatility',
    points: 350,
    progress: { current: 2, target: 3 },
    unlocked: false,
    rarity: 'legendary'
  }
];

// Mock user stats
const mockUserStats = {
  totalAchievements: 1,
  totalPoints: 50,
  completionRate: '10%',
  nextMilestone: 'Week Warrior (100 points)'
};

export default function Achievements() {
  const { achievements, userStats, isLoading } = useGamification();
  const { user } = useAuth();
  
  // Use mock data if context data is empty
  const achievementsData = achievements && achievements.length > 0 ? achievements : mockAchievements;
  const statsData = userStats || mockUserStats;
  
  const [activeCategory, setActiveCategory] = useState('all');
  const [sortBy, setSortBy] = useState('progress');

  const categories = [
    { id: 'all', name: 'All Achievements', icon: FaTrophy },
    { id: 'learning', name: 'Learning', icon: FaBook },
    { id: 'consistency', name: 'Consistency', icon: FaFire },
    { id: 'vocabulary', name: 'Vocabulary', icon: FaStar },
    { id: 'grammar', name: 'Grammar', icon: FaAward },
    { id: 'social', name: 'Social', icon: FaUsers }
  ];

  const filteredAchievements = activeCategory === 'all' 
    ? achievementsData 
    : achievementsData.filter(ach => ach.category === activeCategory);

  const sortedAchievements = [...filteredAchievements].sort((a, b) => {
    switch (sortBy) {
      case 'progress':
        return (b.progress.current / b.progress.target) - (a.progress.current / a.progress.target);
      case 'points':
        return b.points - a.points;
      case 'name':
        return a.title.localeCompare(b.title);
      default:
        return 0;
    }
  });

  const getRarityColor = (rarity) => {
    switch (rarity) {
      case 'common': return '#6b7280';
      case 'uncommon': return '#10b981';
      case 'rare': return '#3b82f6';
      case 'epic': return '#8b5cf6';
      case 'legendary': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const getRarityIcon = (rarity) => {
    switch (rarity) {
      case 'common': return <FaStar style={{ color: '#6b7280' }} />;
      case 'uncommon': return <FaStar style={{ color: '#10b981' }} />;
      case 'rare': return <FaMedal style={{ color: '#3b82f6' }} />;
      case 'epic': return <FaAward style={{ color: '#8b5cf6' }} />;
      case 'legendary': return <FaGem style={{ color: '#f59e0b' }} />;
      default: return <FaStar />;
    }
  };

  const getAchievementIcon = (iconName) => {
    const iconMap = {
      FaTrophy: FaTrophy,
      FaMedal: FaMedal,
      FaAward: FaAward,
      FaStar: FaStar,
      FaFire: FaFire,
      FaBook: FaBook,
      FaClock: FaClock,
      FaUsers: FaUsers,
      FaChartLine: FaChartLine,
      FaGem: FaGem
    };
    const IconComponent = iconMap[iconName] || FaTrophy;
    return <IconComponent />;
  };

  // Remove loading check - show content immediately
  return (
    <div className="achievements-page">
       <Navbar />
      <div className="achievements-header">
        <h1><FaTrophy /> Achievements</h1>
        <p>Unlock badges and earn rewards for your learning progress</p>
      </div>

      <div className="stats-overview">
        <div className="stat-card">
          <div className="stat-icon">
            <FaTrophy />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.totalAchievements}</span>
            <span className="stat-label">Unlocked</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaStar />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.totalPoints}</span>
            <span className="stat-label">Total Points</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaChartLine />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.completionRate}</span>
            <span className="stat-label">Completion</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon">
            <FaFire />
          </div>
          <div className="stat-info">
            <span className="stat-value">{statsData.nextMilestone.split(' ')[0]}</span>
            <span className="stat-label">Next Milestone</span>
          </div>
        </div>
      </div>

      <div className="achievements-controls">
        <div className="category-filters">
          {categories.map(category => {
            const IconComponent = category.icon;
            return (
              <button
                key={category.id}
                className={`category-btn ${activeCategory === category.id ? 'active' : ''}`}
                onClick={() => setActiveCategory(category.id)}
              >
                <IconComponent />
                {category.name}
              </button>
            );
          })}
        </div>

        <div className="sort-options">
          <label>Sort by:</label>
          <select 
            value={sortBy} 
            onChange={(e) => setSortBy(e.target.value)}
            className="sort-select"
          >
            <option value="progress">Progress</option>
            <option value="points">Points</option>
            <option value="name">Name</option>
          </select>
        </div>
      </div>

      <div className="achievements-grid">
        {sortedAchievements.map(achievement => (
          <div 
            key={achievement.id} 
            className={`achievement-card ${achievement.unlocked ? 'unlocked' : 'locked'}`}
            style={{ borderColor: getRarityColor(achievement.rarity) }}
          >
            <div className="achievement-header">
              <div 
                className="achievement-icon"
                style={{ color: getRarityColor(achievement.rarity) }}
              >
                {getAchievementIcon(achievement.icon)}
              </div>
              <div className="achievement-rarity">
                {getRarityIcon(achievement.rarity)}
                <span>{achievement.rarity}</span>
              </div>
            </div>

            <div className="achievement-content">
              <h3>{achievement.title}</h3>
              <p>{achievement.description}</p>
              
              <div className="achievement-progress">
                <div className="progress-bar">
                  <div 
                    className="progress-fill"
                    style={{ 
                      width: `${(achievement.progress.current / achievement.progress.target) * 100}%`,
                      backgroundColor: getRarityColor(achievement.rarity)
                    }}
                  ></div>
                </div>
                <span className="progress-text">
                  {achievement.progress.current}/{achievement.progress.target}
                </span>
              </div>

              <div className="achievement-points">
                <FaStar />
                <span>{achievement.points} points</span>
              </div>
            </div>

            <div className="achievement-status">
              {achievement.unlocked ? (
                <div className="unlocked-badge">
                  <FaCheckCircle />
                  <span>Unlocked</span>
                  {achievement.unlockedAt && (
                    <span className="unlocked-date">
                      {new Date(achievement.unlockedAt).toLocaleDateString()}
                    </span>
                  )}
                </div>
              ) : (
                <div className="locked-badge">
                  <FaLock />
                  <span>Locked</span>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {sortedAchievements.length === 0 && (
        <div className="no-achievements">
          <div className="no-achievements-icon">
            <FaTrophy />
          </div>
          <h3>No achievements found</h3>
          <p>Try selecting a different category or complete more lessons to unlock achievements!</p>
        </div>
      )}
    </div>
  );
};