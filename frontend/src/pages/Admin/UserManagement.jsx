// frontend/src/components/Admin/UserManagement.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';


export default function UserManagement () {
  const { users, updateUserStatus } = useAdmin();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filteredUsers = users.filter(user => {
    const matchesSearch =
      user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleStatusChange = async (userId, newStatus) => {
    try {
      await updateUserStatus(userId, newStatus);
    } catch (error) {
      alert('Error updating user status');
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { class: 'active', label: 'Active' },
      inactive: { class: 'inactive', label: 'Inactive' },
      suspended: { class: 'suspended', label: 'Suspended' }
    };

    const config = statusConfig[status] || statusConfig.active;
    return <span className={`status-badge ${config.class}`}>{config.label}</span>;
  };

  return (
    <div className="user-management">
      <div className="section-header">
        <h3>👥 User Management</h3>
        <span className="user-count">{filteredUsers.length} users</span>
      </div>

      <div className="user-filters">
        <input
          type="text"
          placeholder="Search users..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="status-filter"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
          <option value="suspended">Suspended</option>
        </select>
      </div>

      <div className="users-list">
        {filteredUsers.slice(0, 10).map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <div className="user-avatar">
                {user.username.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <div className="username">{user.username}</div>
                <div className="user-email">{user.email}</div>
                <div className="user-stats">
                  Level {user.level} • {user.xp} XP • {user.lessonsCompleted} lessons
                </div>
              </div>
            </div>

            <div className="user-actions">
              <div className="user-status">
                {getStatusBadge(user.status)}
                <span className="last-active">
                  Last active: {new Date(user.lastActive).toLocaleDateString()}
                </span>
              </div>

              <select
                value={user.status}
                onChange={(e) => handleStatusChange(user.id, e.target.value)}
                className="status-select"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="suspended">Suspended</option>
              </select>

              <button className="view-details-btn">View Details</button>
            </div>
          </div>
        ))}
      </div>

      {filteredUsers.length > 10 && (
        <div className="view-all-section">
          <button className="view-all-btn">
            View All {filteredUsers.length} Users →
          </button>
        </div>
      )}
    </div>
  );
};

