import React from 'react';
import { 
  FaBook, 
  FaTrophy, 
  FaDumbbell, 
  FaEdit, 
  FaChartBar,
  FaStar,
  FaCheckCircle,
  FaClock
} from 'react-icons/fa';
import './RecentActivity.css';

export default function RecentActivity({ activities = [] }) {
  const recentActivities = activities.length > 0 ? activities : [
    {
      id: 1,
      type: 'lesson',
      title: 'Advanced Vocabulary Practice',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      xpEarned: 50,
      accuracy: 85,
      duration: '15 min'
    },
    
    {
      id: 3,
      type: 'practice',
      title: 'Speaking Exercise Completed',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), 
      xpEarned: 30,
      accuracy: 92,
      duration: '10 min'
    },
    {
      id: 4,
      type: 'quiz',
      title: 'Grammar Mastery Test',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), 
      xpEarned: 75,
      accuracy: 78,
      score: 'A-'
    }
  ];

  const getActivityIcon = (type) => {
    const icons = {
      lesson: <FaBook />,
      achievement: <FaTrophy />,
      practice: <FaDumbbell />,
      quiz: <FaEdit />
    };
    return icons[type] || <FaChartBar />;
  };

  const getActivityColor = (type) => {
    const colors = {
      lesson: '#3b82f6', 
      achievement: '#f59e0b',
      practice: '#10b981', 
      quiz: '#8b5cf6' 
    };
    return colors[type] || '#6b7280'; 
  };

  const getActivityType = (type) => {
    const types = {
      lesson: 'Lesson',
      achievement: 'Achievement',
      practice: 'Practice',
      quiz: 'Quiz'
    };
    return types[type] || 'Activity';
  };

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'Unknown date';

  const dateObj = timestamp instanceof Date ? timestamp : new Date(timestamp);
  if (isNaN(dateObj.getTime())) return 'Invalid date';

  const now = new Date();
  const diffInHours = Math.floor((now - dateObj) / (1000 * 60 * 60));

  if (diffInHours < 1) return 'Just now';
  if (diffInHours < 24) return `${diffInHours}h ago`;
  if (diffInHours < 168) return `${Math.floor(diffInHours / 24)}d ago`;
  return dateObj.toLocaleDateString();
};


  const getAccuracyColor = (accuracy) => {
    if (accuracy >= 90) return '#10b981'; 
    if (accuracy >= 80) return '#3b82f6'; 
    if (accuracy >= 70) return '#f59e0b'; 
    return '#ef4444'; 
  };

  return (
    <div className="recent-activity">
      <div className="activity-header">
        <h3>Recent Activity</h3>
        <span className="activity-subtitle">Your learning journey</span>
      </div>
      
      <div className="activity-list">
        {recentActivities.map(activity => (
          <div key={activity.id} className="activity-item">
            <div 
              className="activity-icon"
              style={{ backgroundColor: getActivityColor(activity.type) }}
            >
              {getActivityIcon(activity.type)}
            </div>
            
            <div className="activity-content">
              <div className="activity-main">
                <div className="activity-title">{activity.title}</div>
                <div className="activity-type">{getActivityType(activity.type)}</div>
              </div>
              
              <div className="activity-meta">
                <div className="meta-left">
                  <span className="activity-time">
                    <FaClock /> {formatTimeAgo(activity.timestamp)}
                  </span>
                  {activity.duration && (
                    <span className="activity-duration">{activity.duration}</span>
                  )}
                  {activity.badge && (
                    <span className="activity-badge">{activity.badge}</span>
                  )}
                </div>
                
                
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};