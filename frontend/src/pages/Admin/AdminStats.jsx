// frontend/src/components/Admin/AdminStats.jsx
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';


export default function AdminStats () {
  const { adminStats } = useAdmin();

  if (!adminStats) {
    return <div>Loading statistics...</div>;
  }

  const statCards = [
    {
      title: 'Total Users',
      value: adminStats.totalUsers.toLocaleString(),
      icon: '👥',
      change: '+12%',
      trend: 'up'
    },
    {
      title: 'Active Users',
      value: adminStats.activeUsers.toLocaleString(),
      icon: '🔥',
      change: '+5%',
      trend: 'up'
    },
    {
      title: 'New Today',
      value: adminStats.newUsersToday.toString(),
      icon: '🆕',
      change: '+3',
      trend: 'up'
    },
    {
      title: 'Lessons Completed',
      value: adminStats.lessonsCompleted.toLocaleString(),
      icon: '✅',
      change: '+8%',
      trend: 'up'
    },
    {
      title: 'Average Accuracy',
      value: `${adminStats.averageAccuracy}%`,
      icon: '🎯',
      change: '+2%',
      trend: 'up'
    },
    {
      title: 'Total XP Earned',
      value: adminStats.totalXP.toLocaleString(),
      icon: '⭐',
      change: '+15%',
      trend: 'up'
    }
  ];

  return (
    <div className="admin-stats">
      <h2>Platform Overview</h2>
      <div className="stats-grid">
        {statCards.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-header">
              <div className="stat-icon">{stat.icon}</div>
              <div className={`trend-indicator ${stat.trend}`}>
                {stat.change}
              </div>
            </div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-title">{stat.title}</div>
          </div>
        ))}
      </div>

      <div className="platform-health">
        <h3>Platform Health</h3>
        <div className="health-metrics">
          <div className="metric">
            <span className="metric-label">Uptime</span>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '99.9%' }}></div>
            </div>
            <span className="metric-value">99.9%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Response Time</span>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '95%' }}></div>
            </div>
            <span className="metric-value">125ms</span>
          </div>
          <div className="metric">
            <span className="metric-label">AI Service</span>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: '98%' }}></div>
            </div>
            <span className="metric-value">Operational</span>
          </div>
        </div>
      </div>
    </div>
  );
};


