import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaBookOpen } from 'react-icons/fa';
import { fetchLessons, getUserProgress } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import './CourseTree.css';

export default function CourseTree() {
  const [courseData, setCourseData] = useState([]);
  const [progress, setProgress] = useState({ current_level: 1, completedLessons: [], unlockedSkills: [] });
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

useEffect(() => {
  const getData = async () => {
    setLoading(true);
    try {
      const response = await fetchLessons();
      const lessonsData = response.courseData || [];
      setCourseData(lessonsData);

      const userId = JSON.parse(localStorage.getItem('user')).id;
      const res = await getUserProgress(userId);
      const userProgress = res.data || { current_level: 1, lessons_completed: [] };

      const unlockedSkills = [];
      lessonsData.forEach(level => {
        if (level.level <= userProgress.current_level) {
          level.skills.forEach(skill => unlockedSkills.push(skill.id));
        }
      });

      setProgress({
        ...userProgress,
        unlockedSkills,
        completedLessons: userProgress.lessons_completed,
      });


const localProgress = JSON.parse(localStorage.getItem('userProgress')) || {};
if (localProgress.lessons_completed?.length) {
  const merged = [...new Set([
    ...userProgress.lessons_completed,
    ...localProgress.lessons_completed,
  ])];
  setProgress(prev => ({ ...prev, completedLessons: merged }));
}

    } catch (err) {
      console.error('Error fetching lessons:', err);
    } finally {
      setLoading(false);
    }
  };
  getData();
}, []);


const handleSkillClick = (skill) => {
  const locked = !progress.unlockedSkills.includes(skill.id);
  if (!locked) {
    navigate(`/lesson/${skill.id}`);
  }
};


  if (loading) return <div className="loading">Loading lessons...</div>;

  return (
    <div className="course-tree">
      <div className="course-header">
        <h1>English Course</h1>
        <p>Progress through levels and master your skills!</p>
      </div>

      <div className="vertical-tree-container">
        <div className="vertical-tree-content">
          {courseData.map((level, index) => {
            const unlocked = level.level <= progress.current_level;
            return (
              <div key={level.level} className="vertical-level-section">
                <div className={`vertical-level-header ${unlocked ? 'unlocked' : 'locked'}`}>
                  <div className="level-indicator">
                    <span className="level-number">{level.level}</span>
                  </div>
                  <div className="level-info">
                    <h2>{`Level ${level.level}`}</h2>
                    <div className="level-title">{level.title}</div>
                  </div>
                  {!unlocked && <div className="lock-icon"><FaLock /></div>}
                </div>

                <div className="vertical-skills-container">
                  {level.skills.map(skill => {
                    const completed = progress.completedLessons.includes(skill.id);
                    const locked = !progress.unlockedSkills.includes(skill.id);
                    return (
                      <div
                        key={skill.id}
                        className={`vertical-skill-node ${completed ? 'completed' : ''} ${locked ? 'locked' : 'available'}`}
                        onClick={() => handleSkillClick(skill)}
                      >
                        <div className="skill-icon">
                          {completed ? <FaCheckCircle className="completed-icon" /> : locked ? <FaLock className="locked-icon" /> : <FaBookOpen className="available-icon" />}
                        </div>
                        <div className="skill-info">
                          <div className="skill-title">{skill.title}</div>
                          {completed && <span className="completion-badge">Completed</span>}
                          {locked && <span className="locked-text">Locked</span>}
                        </div>
                      </div>
                    );
                  })}
                </div>

                {index < courseData.length - 1 && <div className="level-connector"></div>}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
