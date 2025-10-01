import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaBookOpen } from 'react-icons/fa';
import { fetchLessons } from '../../services/api';
import './CourseTree.css';

export default function CourseTree() {
  const [courseData, setCourseData] = useState([]);
  const [progress, setProgress] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const response = await fetchLessons();
        const lessonsData = response.courseData || [];
        setCourseData(lessonsData);

        const mockProgress = {
          current_level: 2,
          lessons_completed: [1, 2, 3],
        };

        const unlockedSkills = [];
        lessonsData.forEach(level => {
          if (level.level <= mockProgress.current_level) {
            level.skills.forEach(skill => unlockedSkills.push(skill.id));
          }
        });

        setProgress({
          ...mockProgress,
          unlockedSkills,
          completedLessons: mockProgress.lessons_completed,
        });
      } catch (err) {
        console.error('Error fetching lessons:', err);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

const navigate = useNavigate();

const handleSkillClick = (skill) => {
  const completed = progress.completedLessons?.includes(skill.id);
  const locked = !progress.unlockedSkills?.includes(skill.id);
  if (!locked && !completed) {
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
                    const completed = progress.completedLessons?.includes(skill.id);
                    const locked = !progress.unlockedSkills?.includes(skill.id);
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
