import React, { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaCheckCircle, FaLock, FaBookOpen, FaArrowRight } from 'react-icons/fa';
import { fetchLessons, getUserProgress } from '../../services/api';
import { useAuth } from '../../contexts/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CourseTree.css';

gsap.registerPlugin(ScrollTrigger);

export default function CourseTree() {
  const [courseData, setCourseData] = useState([]);
  const [progress, setProgress] = useState({ current_level: 1, completedLessons: [], unlockedSkills: [] });
  const [loading, setLoading] = useState(true);

  const { currentUser } = useAuth();
  const navigate = useNavigate();

  const headerRef = useRef(null);
  const levelsRef = useRef([]);

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

  useEffect(() => {
    if (loading || courseData.length === 0) return;

    // Animate header
    if (headerRef.current) {
      gsap.from(headerRef.current, {
        opacity: 0,
        y: 50,
        duration: 1,
        ease: 'power3.out',
      });
    }

    // Animate each level with scroll trigger - ensure levels are always visible
    levelsRef.current.forEach((levelEl, index) => {
      if (!levelEl) return;

      // Set initial state to visible
      gsap.set(levelEl, { opacity: 1, y: 0 });

      // Only animate if not the first level
      if (index > 0) {
        gsap.from(levelEl, {
          opacity: 0,
          y: 100,
          duration: 1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: levelEl,
            start: 'top 80%',
            end: 'bottom 20%',
            toggleActions: 'play none none reverse',
          },
          delay: index * 0.2,
        });
      } else {
        // First level is always visible
        gsap.set(levelEl, { opacity: 1, y: 0 });
      }

      // Animate skills within each level - ensure they're visible
      const skills = levelEl.querySelectorAll('.level-skill-card');
      skills.forEach((skill, skillIndex) => {
        // Set initial state to visible
        gsap.set(skill, { opacity: 1, y: 0 });
        
        gsap.from(skill, {
          opacity: 0,
          x: -50,
          duration: 0.8,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: skill,
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
          delay: skillIndex * 0.1,
        });
      });
    });

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, [loading, courseData]);

  const handleSkillClick = (skill) => {
    const locked = !progress.unlockedSkills.includes(skill.id);
    if (!locked) {
      navigate(`/lesson/${skill.id}`);
    }
  };

  if (loading) {
    return (
      <div className="course-tree-loading">
        <div className="loading-spinner"></div>
        <p>Loading lessons...</p>
      </div>
    );
  }

  // Sample images for each level (you can replace with actual images)
  const levelImages = [
    'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800',
    'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800',
    'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800',
    'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=800',
    'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800',
  ];

  return (
    <div className="course-tree">
      {/* Hero Header Section */}
      <div className="course-hero" ref={headerRef}>
        <div className="course-hero-content">
          <h1 className="course-hero-title">English Course</h1>
          <p className="course-hero-subtitle">
            Master English step by step through structured levels designed for your success
          </p>
        </div>
      </div>

      {/* Levels Section */}
      <div className="course-levels">
        {courseData.map((level, index) => {
          const unlocked = level.level <= progress.current_level;
          const isEven = index % 2 === 0;
          
          return (
            <div
              key={level.level}
              className={`level-section ${isEven ? 'level-left' : 'level-right'}`}
              ref={el => levelsRef.current[index] = el}
            >
              <div className={`level-content-wrapper ${isEven ? '' : 'level-reverse'}`}>
                {/* Image Side */}
                <div className="level-image-wrapper">
                  <div className="level-image-container">
                    <img
                      src={levelImages[index % levelImages.length]}
                      alt={`Level ${level.level}`}
                      className="level-image"
                    />
                    <div className={`level-image-overlay ${unlocked ? 'unlocked' : 'locked'}`}>
                      <div className="level-badge">
                        <span className="level-number-large">{level.level}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Side */}
                <div className="level-text-wrapper">
                  <div className="level-header-text">
                    <span className="level-label">Level {level.level}</span>
                    <h2 className="level-title-main">{level.title}</h2>
                    <p className="level-description">
                      Master essential skills through carefully structured lessons designed to build your confidence and fluency.
                    </p>
                  </div>

                  <div className="level-skills-grid">
                    {level.skills.map((skill, skillIndex) => {
                      const completed = progress.completedLessons.includes(skill.id);
                      const locked = !progress.unlockedSkills.includes(skill.id);
                      
                      return (
                        <div
                          key={skill.id}
                          className={`level-skill-card ${completed ? 'completed' : ''} ${locked ? 'locked' : 'available'}`}
                          onClick={() => handleSkillClick(skill)}
                        >
                          <div className="skill-card-icon">
                            {completed ? (
                              <FaCheckCircle className="skill-icon completed-icon" />
                            ) : locked ? (
                              <FaLock className="skill-icon locked-icon" />
                            ) : (
                              <FaBookOpen className="skill-icon available-icon" />
                            )}
                          </div>
                          <div className="skill-card-content">
                            <h3 className="skill-card-title">{skill.title}</h3>
                            {completed && <span className="skill-status completed-status">Completed</span>}
                            {locked && <span className="skill-status locked-status">Locked</span>}
                          </div>
                          {!locked && (
                            <div className="skill-card-arrow">
                              <FaArrowRight />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
