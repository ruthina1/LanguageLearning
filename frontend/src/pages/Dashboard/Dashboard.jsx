import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useProgress } from '../../contexts/ProgressContext';
import { lessonsAPI } from '../../services/api';
import ProgressChart from './ProgressChart';
import WeakAreasCard from './WeakAreasCard';
import RecentActivity from './RecentActivity';
import WeeklyStats from './WeeklyStats';
import { FaUser, FaTrophy, FaFire, FaChartLine, FaBook, FaStar,FaRocket,FaBullseye,FaCheckCircle,FaClock,FaLightbulb,FaMicrophone,FaHeadphones,FaComments,FaPenAlt,FaExclamationTriangle
} from 'react-icons/fa';
import './Dashboard.css';

const focusedPracticeOptions = [
  {
    id: 1,
    type: 'speaking',
    title: 'Speaking Practice',
    description: 'Improve pronunciation with voice recognition',
    icon: FaMicrophone,
    time: '10 min',
    xp: 30,
    color: '#6a11cb'
  },
  {
    id: 2,
    type: 'listening',
    title: 'Listening Comprehension',
    description: 'Train your ear with audio exercises',
    icon: FaHeadphones,
    time: '15 min',
    xp: 45,
    color: '#2575fc'
  },
  {
    id: 3,
    type: 'conversation',
    title: 'Conversation Practice',
    description: 'Practice real-life dialogues',
    icon: FaComments,
    time: '20 min',
    xp: 60,
    color: '#00b4db'
  },
  {
    id: 4,
    type: 'writing',
    title: 'Writing Exercise',
    description: 'Improve your writing skills',
    icon: FaPenAlt,
    time: '12 min',
    xp: 35,
    color: '#ff6b6b'
  }
];

export default function Dashboard() {
  const { user } = useAuth();
  const { progress, isLoading, activities, updateProgress } = useProgress();
  const [suggestedLessons, setSuggestedLessons] = useState([]);
  const [lessonsLoading, setLessonsLoading] = useState(true);
  const [practiceLoading, setPracticeLoading] = useState(null);

  useEffect(() => {
    fetchSuggestedLessons();
  }, []);

  const fetchSuggestedLessons = async () => {
    try {
      setLessonsLoading(true);
      const response = await lessonsAPI.getSuggestedLessons();
      setSuggestedLessons(response.data);
    } catch (error) {
      console.error('Error fetching suggested lessons:', error);
      // Fallback to mock data
      setSuggestedLessons(getMockSuggestedLessons());
    } finally {
      setLessonsLoading(false);
    }
  };

  const getMockSuggestedLessons = () => [
    {
      id: 1,
      skill: 'Grammar',
      title: 'Present Perfect Tense',
      difficulty: 'Intermediate',
      description: 'Master the present perfect tense with interactive exercises',
      estimatedTime: '15 min',
      xpReward: 50
    },
    {
      id: 2,
      skill: 'Vocabulary',
      title: 'Business English',
      difficulty: 'Advanced',
      description: 'Learn professional vocabulary for workplace communication',
      estimatedTime: '20 min',
      xpReward: 75
    },
    {
      id: 3,
      skill: 'Speaking',
      title: 'Pronunciation Practice',
      difficulty: 'Beginner',
      description: 'Improve your pronunciation with voice recognition',
      estimatedTime: '10 min',
      xpReward: 30
    }
  ];

  const handleStartFocusedPractice = async (practiceType) => {
    try {
      setPracticeLoading(practiceType);
      
      // Find the practice option
      const practice = focusedPracticeOptions.find(p => p.type === practiceType);
      
      // Simulate practice completion after a delay
      setTimeout(async () => {
        const result = await updateProgress({
          xpEarned: practice.xp,
          skill: practiceType.charAt(0).toUpperCase() + practiceType.slice(1),
          activityType: 'practice',
          duration: parseInt(practice.time),
          accuracy: Math.floor(Math.random() * 20) + 80 // Random accuracy between 80-100%
        });

        if (result.success) {
          console.log(`${practiceType} practice completed!`);
          // You can add a toast notification here
        } else {
          console.error('Failed to update progress:', result.error);
        }
        
        setPracticeLoading(null);
      }, 2000); // Simulate 2 second practice

    } catch (error) {
      console.error('Error starting practice:', error);
      setPracticeLoading(null);
    }
  };

  const handleStartLesson = async (lesson) => {
    try {
      console.log('Starting lesson:', lesson.title);
      // Navigate to lesson page or open lesson modal
      // For now, we'll simulate lesson completion
      const result = await updateProgress({
        xpEarned: lesson.xpReward,
        skill: lesson.skill,
        activityType: 'lesson',
        lessonId: lesson.id,
        duration: parseInt(lesson.estimatedTime),
        accuracy: Math.floor(Math.random() * 25) + 75 // Random accuracy between 75-100%
      });

      if (result.success) {
        console.log(`Lesson "${lesson.title}" completed!`);
        // Refresh suggested lessons
        fetchSuggestedLessons();
      }
    } catch (error) {
      console.error('Error starting lesson:', error);
    }
  };

  const display_name = user?.display_name || user?.username || 'Language Learner';

  // Use progress data from context or show loading
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
                <h3>Level {progress.current_level || 1}</h3>
                <span>Current Level</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><FaStar /></div>
              <div className="stat-info">
                <h3>{progress.total_xp || 0} XP</h3>
                <span>Total Experience</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><FaFire /></div>
              <div className="stat-info">
                <h3>{progress.current_streak || 0} days</h3>
                <span>Current Streak</span>
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-icon"><FaChartLine /></div>
              <div className="stat-info">
                <h3>{progress.accuracy || 0}%</h3>
                <span>Accuracy</span>
              </div>
            </div>

        </div>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          
          <section className="progress-section">
            <h2><FaChartLine /> Your Learning Progress</h2>
            {progress?.weeklyProgress ? (
              <ProgressChart weeklyProgress={progress.weeklyProgress} />
            ) : (
              <div className="chart-placeholder">
                <FaExclamationTriangle />
                <p>Progress data not available</p>
              </div>
            )}
          </section>

          <section className="focused-practice-section">
            <h2><FaBullseye /> Start Focused Practice</h2>
            <div className="practice-grid">
              {focusedPracticeOptions.map((practice) => {
                const IconComponent = practice.icon;
                const isLoading = practiceLoading === practice.type;
                
                return (
                  <div 
                    key={practice.id} 
                    className={`practice-card ${isLoading ? 'loading' : ''}`}
                    style={{ '--practice-color': practice.color }}
                    onClick={() => !isLoading && handleStartFocusedPractice(practice.type)}
                  >
                    <div className="practice-icon">
                      <IconComponent />
                    </div>
                    <div className="practice-content">
                      <h4>{practice.title}</h4>
                      <p>{practice.description}</p>
                      <div className="practice-meta">
                        <span className="practice-time"><FaClock /> {practice.time}</span>
                        <span className="practice-xp"><FaStar /> +{practice.xp} XP</span>
                      </div>
                    </div>
                    <button 
                      className={`practice-start-btn ${isLoading ? 'loading' : ''}`}
                      disabled={isLoading}
                    >
                      {isLoading ? <div className="spinner"></div> : <FaRocket />}
                    </button>
                  </div>
                );
              })}
            </div>
          </section>

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
                  <div key={lesson.id} className="suggestion-card">
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
                      <span className="xp-reward"><FaStar /> +{lesson.xpReward} XP</span>
                    </div>
                    <button 
                      className="start-lesson-btn"
                      onClick={() => handleStartLesson(lesson)}
                    >
                      <FaRocket /> Start Practice
                    </button>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>

        <div className="sidebar">
          <WeakAreasCard weakAreas={progress?.weakAreas || []} />
          <RecentActivity activities={activities} />
          <WeeklyStats progress={progress} />
        </div>
      </div>
    </div>
  );
}