// frontend/src/pages/Dashboard/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { getUserProgress } from '../../services/api';
import RecentActivity from './RecentActivity';
import { 
  FaUser, FaTrophy, FaBook, FaRocket, 
  FaBullseye, FaClock, FaLightbulb, FaMicrophone, 
  FaHeadphones, FaComments, FaPenAlt
} from 'react-icons/fa';
import './Dashboard.css';
import { dashboardAPI } from '../../services/api';

const focusedPracticeOptions = [
  {
    id: 1,
    type: 'speaking',
    title: 'Speaking Practice',
    description: 'Improve pronunciation with voice recognition',
    icon: FaMicrophone,
    time: '10 min',
    color: '#6a11cb'
  },
  {
    id: 2,
    type: 'listening',
    title: 'Listening Comprehension',
    description: 'Train your ear with audio exercises',
    icon: FaHeadphones,
    time: '15 min',
    color: '#2575fc'
  },
  {
    id: 3,
    type: 'conversation',
    title: 'Conversation Practice',
    description: 'Practice real-life dialogues',
    icon: FaComments,
    time: '20 min',
    color: '#00b4db'
  },
  {
    id: 4,
    type: 'writing',
    title: 'Writing Exercise',
    description: 'Improve your writing skills',
    icon: FaPenAlt,
    time: '12 min',
    color: '#ff6b6b'
  }
];

export default function Dashboard() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { progress, isLoading, activities } = useProgress();
  const [suggestedLessons, setSuggestedLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [userLevel, setUserLevel] = useState(1);

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
      description: 'Master the present perfect tense with interactive exercises',
      estimatedTime: '15 min'
    },
    {
      id: 2,
      skill: 'Vocabulary',
      title: 'Business English',
      difficulty: 'Advanced',
      description: 'Learn professional vocabulary for workplace communication',
      estimatedTime: '20 min'
    },
    {
      id: 3,
      skill: 'Speaking',
      title: 'Pronunciation Practice',
      difficulty: 'Beginner',
      description: 'Improve your pronunciation with voice recognition',
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
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1><FaUser /> Welcome back, {display_name}! </h1>
          <p>Keep going! You're making great progress in English.</p>
        </div>
        
        <div className="progress-overview">
          <div className="stat-card">
            <div className="stat-icon"><FaTrophy /></div>
            <div className="stat-info">
              <h3>Level {userLevel}</h3>
              <span>Current Level</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon"><FaBook /></div>
            <div className="stat-info">
              <h3>{progress.lessons_completed || 0}</h3>
              <span>Lessons Completed</span>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          {/* 🔹 Focused Practice Section */}
          <section className="focused-practice-section">
            <h2><FaBullseye /> Start Focused Practice</h2>
            <div className="practice-grid">
              {focusedPracticeOptions.map((practice) => {
                const IconComponent = practice.icon;
                return (
                  <div 
                    key={practice.id} 
                    className="practice-card"
                    style={{ '--practice-color': practice.color }}
                    onClick={() => navigate('/lesson')}
                  >
                    <div className="practice-icon">
                      <IconComponent />
                    </div>
                    <div className="practice-content">
                      <h4>{practice.title}</h4>
                      <p>{practice.description}</p>
                      <div className="practice-meta">
                        <span className="practice-time"><FaClock /> {practice.time}</span>
                        <span className="practice-xp"><FaRocket /> Go to Lessons</span>
                      </div>
                    </div>
                    <button className="practice-start-btn">
                      <FaRocket />
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

          {/* 🔹 Recommended Lessons Section */}
          <section className="suggested-lessons">
            <h2><FaLightbulb /> Recommended for You</h2>
            {lessonsLoading ? (
              <div className="loading-lessons">
                <div className="loading-spinner"></div>
                <p>Loading recommended lessons...</p>
              </div>
            ) : (
              <div className="lesson-cards">
                {suggestedLessons.map(lesson => (
                  <div 
                    key={lesson.id} 
                    className="suggestion-card"
                    onClick={() => navigate('/lesson')}
                  >
                    <div className="suggestion-header">
                      <span className="skill-tag">{lesson.skill}</span>
                      <span className={`difficulty-badge ${lesson.difficulty?.toLowerCase()}`}>
                        {lesson.difficulty}
                      </span>
                    </div>
                    <h4>{lesson.title}</h4>
                    <p>{lesson.description}</p>
                    <div className="lesson-meta">
                      <span className="time-estimate"><FaClock /> {lesson.estimatedTime}</span>
                      <span className="xp-reward"><FaBook /> Lesson</span>
                    </div>
                    <button className="start-lesson-btn">
                      <FaRocket /> Go to Lessons
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="sidebar">
          <RecentActivity activities={activities} />
        </div>
      </div>
    </div>
  );
}
