// frontend/src/pages/Admin/AdminDashboard.jsx
import React from 'react';
import { useAdmin } from '../../contexts/AdminContext';
import AdminStats from './AdminStats';
import UserManagement from './UserManagement';
import LessonAnalytics from './LessonAnalytics';
import AIFeedbackMonitor from './AIFeedbackMonitor';
import ContentManager from './ContentManager';


export default function AdminDashboard () {
  const { isAdmin, isLoading } = useAdmin();

  if (isLoading) {
    return <div className="admin-loading">Checking admin privileges...</div>;
  }

  if (!isAdmin) {
    return (
      <div className="admin-denied">
        <div className="denied-content">
          <h1>🔒 Access Denied</h1>
          <p>You don't have administrator privileges to access this page.</p>
          <p>Please contact system administrator if you believe this is an error.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>🏛️ Admin Dashboard</h1>
        <p>Platform Management & Analytics</p>
      </div>

      <div className="admin-nav">
        <button className="nav-item active">📊 Overview</button>
        <button className="nav-item">👥 Users</button>
        <button className="nav-item">📚 Content</button>
        <button className="nav-item">🤖 AI Monitor</button>
        <button className="nav-item">⚙️ Settings</button>
      </div>

      <div className="dashboard-content">
        <div className="main-content">
          <AdminStats />
          <LessonAnalytics />
          <AIFeedbackMonitor />
        </div>

        <div className="sidebar">
          <UserManagement />
          <ContentManager />
        </div>
      </div>
    </div>
  );
};


