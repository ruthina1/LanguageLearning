// frontend/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { getUserProgress } from '../../services/api';
import RecentActivity from './RecentActivity';
import { 
  FaTrophy, FaBook, FaChartLine, FaStar
} from 'react-icons/fa';
import './Dashboard.css';
import { dashboardAPI } from '../../services/api';

const focusedPracticeOptions = [
  {
    id: 1,
    type: 'speaking',
    title: 'Speaking Practice',
    time: '10 min'
  },
  {
    id: 2,
    type: 'listening',
    title: 'Listening Comprehension',
    time: '15 min'
  },
  {
    id: 3,
    type: 'conversation',
    title: 'Conversation Practice',
    time: '20 min'
  },
  {
    id: 4,
    type: 'writing',
    title: 'Writing Exercise',
    time: '12 min'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, isLoading, activities } = useProgress();
  const [suggestedLessons, setSuggestedLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);
  const [streak, setStreak] = useState(7);
  const [totalXP, setTotalXP] = useState(1250);

  useEffect(() => {
    fetchDashboardData();
    fetchUserLevel();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await dashboardAPI.getDashboardData();
      const dashboardData = response.data.data;
      setSuggestedLessons(dashboardData.suggestedLessons);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setSuggestedLessons(getMockSuggestedLessons());
    } finally {
      setLessonsLoading(false);
    }
  };

  const fetchUserLevel = async () => {
    try {
      if (user?.id) {
        const response = await getUserProgress(user.id);
        const userProgress = response.data || { current_level: 1, lessons_completed: [] };
        setUserLevel(userProgress.current_level || 1);
      }
    } catch (error) {
      console.error('Error fetching user level:', error);
      const localProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
      setUserLevel(localProgress.current_level || 1);
    }
  };

  const getMockSuggestedLessons = () => [
    {
      id: 1,
      skill: 'Grammar',
      title: 'Present Perfect Tense',
      difficulty: 'Intermediate',
      estimatedTime: '15 min'
    },
    {
      id: 2,
      skill: 'Vocabulary',
      title: 'Business English',
      difficulty: 'Advanced',
      estimatedTime: '20 min'
    },
    {
      id: 3,
      skill: 'Speaking',
      title: 'Pronunciation Practice',
      difficulty: 'Beginner',
      estimatedTime: '10 min'
    }
  ];

  const display_name = user?.display_name || user?.username || 'Language Learner';

  if (isLoading) {
    return (
      <div className="dashboard">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading your learning dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Dashboard Header */}
      <div className="dashboard-header">
        <h1>Welcome back, {display_name}</h1>
        <p>Here's your learning overview</p>
      </div>

      {/* Stats Grid */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-content">
            <h3>{userLevel}</h3>
            <p>Current Level</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>{progress.lessons_completed || 0}</h3>
            <p>Lessons Completed</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>{totalXP}</h3>
            <p>Total XP</p>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-content">
            <h3>{streak}</h3>
            <p>Day Streak</p>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="dashboard-main">
        <div className="main-column">
          {/* Quick Actions */}
          <section className="dashboard-section">
            <div className="section-title">
              <h2>Quick Practice</h2>
            </div>
            <div className="quick-actions-grid">
              {focusedPracticeOptions.map((practice) => (
                <div 
                  key={practice.id} 
                  className="quick-action-card"
                  onClick={() => navigate('/lesson')}
                >
                  <div className="quick-action-content">
                    <h4>{practice.title}</h4>
                    <span className="quick-action-time">{practice.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Recommended Lessons */}
          <section className="dashboard-section">
            <div className="section-title">
              <h2>Recommended Lessons</h2>
            </div>
            {lessonsLoading ? (
              <div className="loading-lessons">
                <div className="loading-spinner"></div>
                <p>Loading recommended lessons...</p>
              </div>
            ) : (
              <div className="lessons-grid">
                {suggestedLessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    className="lesson-card"
                    onClick={() => navigate('/lesson')}
                  >
                    <div className="lesson-card-header">
                      <span className="lesson-skill">{lesson.skill}</span>
                      <span className={`lesson-difficulty ${lesson.difficulty?.toLowerCase()}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                    <h4>{lesson.title}</h4>
                    <span className="lesson-time">{lesson.estimatedTime}</span>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Sidebar */}
        <div className="sidebar-column">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
