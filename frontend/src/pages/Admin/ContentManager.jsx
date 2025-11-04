// frontend/src/components/Admin/ContentManager.jsx
import React, { useState } from 'react';
import { useAdmin } from '../../contexts/AdminContext';

export default function ContentManager () {
  const { createLesson, updateLesson } = useAdmin();
  const [activeTab, setActiveTab] = useState('lessons');
  const [showCreateForm, setShowCreateForm] = useState(false);

  const [newLesson, setNewLesson] = useState({
    title: '',
    description: '',
    level: 1,
    language: 'en',
    skills: [],
    exercises: []
  });

  const handleCreateLesson = async (e) => {
    e.preventDefault();
    try {
      await createLesson(newLesson);
      setShowCreateForm(false);
      setNewLesson({
        title: '',
        description: '',
        level: 1,
        language: 'en',
        skills: [],
        exercises: []
      });
    } catch (error) {
      alert('Error creating lesson');
    }
  };

  return (
    <div className="content-manager">
      <div className="section-header">
        <h3>📚 Content Management</h3>
        <button 
          onClick={() => setShowCreateForm(true)}
          className="create-btn"
        >
          + Create Lesson
        </button>
      </div>

      <div className="content-tabs">
        <button 
          className={activeTab === 'lessons' ? 'active' : ''}
          onClick={() => setActiveTab('lessons')}
        >
          Lessons
        </button>
        <button 
          className={activeTab === 'exercises' ? 'active' : ''}
          onClick={() => setActiveTab('exercises')}
        >
          Exercises
        </button>
        <button 
          className={activeTab === 'ai' ? 'active' : ''}
          onClick={() => setActiveTab('ai')}
        >
          AI Training
        </button>
      </div>

      {showCreateForm && (
        <div className="create-lesson-modal">
          <div className="modal-content">
            <h4>Create New Lesson</h4>
            <form onSubmit={handleCreateLesson}>
              <div className="form-group">
                <label>Title:</label>
                <input
                  type="text"
                  value={newLesson.title}
                  onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Description:</label>
                <textarea
                  value={newLesson.description}
                  onChange={(e) => setNewLesson({ ...newLesson, description: e.target.value })}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Level:</label>
                <select
                  value={newLesson.level}
                  onChange={(e) => setNewLesson({ ...newLesson, level: parseInt(e.target.value) })}
                >
                  {[1, 2, 3, 4, 5].map((level) => (
                    <option key={level} value={level}>
                      Level {level}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-actions">
                <button type="button" onClick={() => setShowCreateForm(false)}>
                  Cancel
                </button>
                <button type="submit">Create Lesson</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="content-stats">
        <div className="stat-item">
          <span className="stat-number">150</span>
          <span className="stat-label">Total Lessons</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">45</span>
          <span className="stat-label">Active Lessons</span>
        </div>
        <div className="stat-item">
          <span className="stat-number">12</span>
          <span className="stat-label">Needs Review</span>
        </div>
      </div>
    </div>
  );
};

