// frontend/src/pages/Gamification/Leaderboard.jsx
import React, { useState } from 'react';
import { useGamification } from '../../contexts/GamificationContext';
import { useAuth } from '../../contexts/AuthContext';
import { FaTrophy, FaCrown, FaMedal, FaUser, FaSync, FaFire, FaChartLine, FaAward, FaStar } from 'react-icons/fa';
import './Leaderboard.css';
import Navbar from '../../components/Layout/Navbar';

// Mock data for testing
const mockLeaderboard = [
  {
    userId: 'user1',
    username: 'Alice Johnson',
    avatar: '👩‍🎓',
    rank: 1,
    xp: 12500,
    level: 8,
    streak: 45,
    isCurrentUser: true
  },
  {
    userId: 'user2',
    username: 'Bob Smith',
    avatar: '👨‍💻',
    rank: 2,
    xp: 11800,
    level: 7,
    streak: 32,
    isCurrentUser: false
  },
  {
    userId: 'user3',
    username: 'Carol Davis',
    avatar: '👩‍🏫',
    rank: 3,
    xp: 10500,
    level: 7,
    streak: 28,
    isCurrentUser: false
  },
  {
    userId: 'user4',
    username: 'David Wilson',
    avatar: '👨‍🎓',
    rank: 4,
    xp: 8900,
    level: 6,
    streak: 15,
    isCurrentUser: false
  },
  {
    userId: 'user5',
    username: 'Emma Brown',
    avatar: '👩‍🔬',
    rank: 5,
    xp: 7600,
    level: 6,
    streak: 42,
    isCurrentUser: false
  },
  {
    userId: 'user6',
    username: 'Frank Miller',
    avatar: '👨‍🔧',
    rank: 6,
    xp: 6500,
    level: 5,
    streak: 18,
    isCurrentUser: false
  },
  {
    userId: 'user7',
    username: 'Grace Lee',
    avatar: '👩‍🍳',
    rank: 7,
    xp: 5200,
    level: 5,
    streak: 25,
    isCurrentUser: false
  },
  {
    userId: 'user8',
    username: 'Henry Taylor',
    avatar: '👨‍🌾',
    rank: 8,
    xp: 4300,
    level: 4,
    streak: 12,
    isCurrentUser: false
  },
  {
    userId: 'user9',
    username: 'Ivy Chen',
    avatar: '👩‍🎨',
    rank: 9,
    xp: 3800,
    level: 4,
    streak: 8,
    isCurrentUser: false
  },
  {
    userId: 'user10',
    username: 'Jack Wilson',
    avatar: '👨‍🚀',
    rank: 10,
    xp: 2900,
    level: 3,
    streak: 5,
    isCurrentUser: false
  }
];

export default function Leaderboard() {
  const { leaderboard, refreshLeaderboard, isLoading } = useGamification();
  const { user } = useAuth();
  
  // Use mock data immediately and ignore loading state
  const leaderboardData = mockLeaderboard;
  
  const [timeRange, setTimeRange] = useState('weekly');

  const getRankIcon = (rank) => {
    switch (rank) {
      case 1: return <FaCrown style={{ color: '#FFD700' }} />;
      case 2: return <FaMedal style={{ color: '#C0C0C0' }} />;
      case 3: return <FaMedal style={{ color: '#CD7F32' }} />;
      default: return `#${rank}`;
    }
  };

  const getXPColor = (xp) => {
    if (xp >= 10000) return '#ff6b6b';
    if (xp >= 5000) return '#4ecdc4';
    if (xp >= 1000) return '#45b7d1';
    return '#96ceb4';
  };

  // Remove the loading check entirely - show content immediately
  const currentUser = leaderboardData.find(u => u.isCurrentUser);

  return (
    <div className="leaderboard-page">
       <Navbar />
      <div className="leaderboard-header">
        <h1><FaTrophy /> Leaderboard</h1>
        <div className="time-range-selector">
          <button
            className={`time-btn ${timeRange === 'weekly' ? 'active' : ''}`}
            onClick={() => setTimeRange('weekly')}
          >
            Weekly
          </button>
          <button
            className={`time-btn ${timeRange === 'monthly' ? 'active' : ''}`}
            onClick={() => setTimeRange('monthly')}
          >
            Monthly
          </button>
          <button
            className={`time-btn ${timeRange === 'all-time' ? 'active' : ''}`}
            onClick={() => setTimeRange('all-time')}
          >
            All Time
          </button>
        </div>
      </div>

      <div className="leaderboard-container">
        <div className="leaderboard-list">
          {leaderboardData.map((user) => (
            <div
              key={user.userId}
              className={`leaderboard-item ${user.isCurrentUser ? 'current-user' : ''}`}
            >
              <div className="rank-section">
                <span className="rank-icon">{getRankIcon(user.rank)}</span>
                <span className="rank-number">{user.rank}</span>
              </div>

              <div className="user-info">
                <div className="avatar">{user.avatar || <FaUser />}</div>
                <div className="user-details">
                  <div className="username">
                    {user.username}
                    {user.isCurrentUser && <span className="you-badge">You</span>}
                  </div>
                  <div className="user-stats">
                    <span className="level">Level {user.level}</span>
                    <span className="streak"><FaFire /> {user.streak} day streak</span>
                  </div>
                </div>
              </div>

              <div className="xp-section">
                <div className="xp-bar-container">
                  <div
                    className="xp-bar"
                    style={{ 
                      backgroundColor: getXPColor(user.xp),
                      width: `${Math.min((user.xp / 15000) * 100, 100)}%`
                    }}
                  ></div>
                </div>
                <span className="xp-amount">{user.xp.toLocaleString()} XP</span>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-sidebar">
          <div className="current-user-stats">
            <h3><FaAward /> Your Position</h3>
            {currentUser ? (
              <div className="user-position">
                <div className="position-rank">
                  {getRankIcon(currentUser.rank)}
                  <span>Rank {currentUser.rank}</span>
                </div>
                <div className="position-details">
                  <p><FaStar /> Total XP: {currentUser.xp.toLocaleString()}</p>
                  <p><FaChartLine /> Level: {currentUser.level}</p>
                  <p><FaFire /> Streak: {currentUser.streak} days</p>
                </div>
              </div>
            ) : (
              <p>You're not on the leaderboard yet. Keep learning!</p>
            )}
          </div>

          <div className="leaderboard-tips">
            <h3><FaTrophy /> Leaderboard Tips</h3>
            <ul>
              <li><FaFire /> Complete daily lessons to maintain your streak</li>
              <li><FaStar /> Focus on accuracy for bonus XP</li>
              <li><FaChartLine /> Practice weak areas to earn more points</li>
              <li><FaAward /> Come back daily for streak multipliers</li>
            </ul>
          </div>

          <button className="refresh-btn" onClick={refreshLeaderboard}>
            <FaSync /> Refresh Leaderboard
          </button>
        </div>
      </div>
    </div>
  );
};