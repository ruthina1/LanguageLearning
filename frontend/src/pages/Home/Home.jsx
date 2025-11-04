// frontend/src/pages/Home/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaMicrophone, FaChartLine, FaTrophy, FaUsers, FaGlobe,
  FaComments, FaPenAlt, FaCheckCircle, FaArrowRight, FaQuoteLeft,
  FaRocket, FaPlay, FaGraduationCap, FaShieldAlt, FaInfinity, FaHeadphones
} from 'react-icons/fa';
import './Home.css';

gsap.registerPlugin(ScrollTrigger);

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const heroRef = useRef(null);
  const sectionNavRef = useRef(null);
  const scrollIndicatorRef = useRef(null);

  const stats = [
    { number: '50K+', label: 'Active Learners' },
    { number: '15+', label: 'Languages' },
    { number: '5+', label: 'Years Experience' }
  ];

  const techStack = ['Speaking', 'Grammar', 'Pronounciation', 'Reading', 'Writting'];

  const features = [
    {
      icon: FaMicrophone,
      title: 'AI-Powered Pronunciation',
      description: 'Real-time voice recognition technology provides instant feedback'
    },
    {
      icon: FaChartLine,
      title: 'Personalized Learning Path',
      description: 'Adaptive algorithms create custom lessons based on your progress'
    },
    {
      icon: FaTrophy,
      title: 'Gamified Experience',
      description: 'Earn XP, unlock achievements, and climb leaderboards'
    }
  ];

  const practiceTypes = [
    {
      icon: FaMicrophone,
      title: 'Speaking Practice',
      description: 'Master pronunciation with advanced voice recognition',
      color: '#d4a574'
    },
    {
      icon: FaHeadphones,
      title: 'Listening Comprehension',
      description: 'Train your ear with authentic audio content',
      color: '#b8926a'
    },
    {
      icon: FaComments,
      title: 'Conversation Practice',
      description: 'Build confidence in real-life dialogues',
      color: '#9b7f5a'
    },
    {
      icon: FaPenAlt,
      title: 'Writing Excellence',
      description: 'Perfect your writing with intelligent feedback',
      color: '#8a6f4a'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Business Professional',
      text: 'LinguaLearn transformed my business communication skills. In 3 months, I went from hesitant to confident in meetings.',
      avatar: 'MR'
    },
    {
      name: 'David Chen',
      role: 'University Student',
      text: 'The personalized practice sessions helped me ace my TOEFL exam. The speaking exercises were incredibly effective!',
      avatar: 'DC'
    },
    {
      name: 'Sarah Johnson',
      role: 'Travel Enthusiast',
      text: 'Finally I can travel and connect with people authentically. The cultural context in lessons makes all the difference.',
      avatar: 'SJ'
    }
  ];

  useEffect(() => {
    // Hero animations - only animate position, keep opacity at 1 always
    gsap.set(['.hero-line-1', '.hero-line-2', '.hero-subtitle', '.tech-badge', '.stat-item', '.hero-actions'], {
      opacity: 1,
      y: 0
    });

    const heroTl = gsap.timeline({ defaults: { opacity: 1 } });
    heroTl
      .from('.hero-line-1', { y: 100, duration: 1, ease: 'power3.out' })
      .from('.hero-line-2', { y: 100, duration: 1, ease: 'power3.out' }, '-=0.7')
      .from('.hero-subtitle', { y: 30, duration: 0.8 }, '-=0.5')
      .from('.tech-badge', { 
        y: 20, 
        duration: 0.6, 
        stagger: 0.1
      }, '-=0.4')
      .from('.stat-item', { 
        y: 30, 
        duration: 0.8, 
        stagger: 0.15
      }, '-=0.6')
      .from('.hero-actions', { y: 30, duration: 0.8 }, '-=0.4');

    // Section navigation scroll animations
    ScrollTrigger.create({
      trigger: '.home-page',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: (self) => {
        const sections = document.querySelectorAll('[data-section]');
        const scrollPos = window.scrollY + window.innerHeight / 2;
        
        sections.forEach((section, index) => {
          const sectionTop = section.offsetTop;
          const sectionBottom = sectionTop + section.offsetHeight;
          
          if (scrollPos >= sectionTop && scrollPos < sectionBottom) {
            document.querySelectorAll('.nav-item').forEach(item => {
              item.classList.remove('active');
            });
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems[index]) navItems[index].classList.add('active');
          }
        });
      }
    });

    // Scroll indicator
    gsap.to('.scroll-indicator', {
      y: 10,
      repeat: -1,
      yoyo: true,
      duration: 1.5,
      ease: 'power2.inOut'
    });

    // Section scroll animations - keep content visible
    gsap.utils.toArray('[data-section]').forEach((section) => {
      const content = section.querySelector('.section-content');
      if (content) {
        gsap.set(content.children, { opacity: 1, y: 0 });
        gsap.from(content.children, {
          scrollTrigger: {
            trigger: section,
            start: 'top 80%',
            toggleActions: 'play none none reverse'
          },
          y: 60,
          opacity: 1,
          duration: 1,
          stagger: 0.2,
          ease: 'power3.out'
        });
      }
    });

    // Feature cards animation - keep visible
    gsap.utils.toArray('.feature-card').forEach((card, index) => {
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });

    // Practice cards animation - keep visible
    gsap.utils.toArray('.practice-type-card').forEach((card, index) => {
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });

    // Testimonial cards animation - keep visible
    gsap.utils.toArray('.testimonial-card').forEach((card, index) => {
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 50,
        opacity: 1,
        duration: 0.8,
        delay: index * 0.1,
        ease: 'power2.out'
      });
    });

  }, []);

  const handleGetStarted = () => {
    if (user) {
      navigate('/dashboard');
    } else {
      navigate('/signup');
    }
  };

  const handleTryDemo = () => {
    navigate('/practice/demo');
  };

  const scrollToSection = (sectionId) => {
    const section = document.getElementById(sectionId);
    if (section) {
      window.scrollTo({
        top: section.offsetTop,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="home-page">
      {/* Section Navigation */}
      <nav className="section-nav" ref={sectionNavRef}>
        <div className="nav-item active" onClick={() => scrollToSection('hero')}>
          <span className="nav-number">[01]</span>
          <span className="nav-label">Home</span>
        </div>
        <div className="nav-item" onClick={() => scrollToSection('features')}>
          <span className="nav-number">[02]</span>
          <span className="nav-label">Features</span>
        </div>
        <div className="nav-item" onClick={() => scrollToSection('practice')}>
          <span className="nav-number">[03]</span>
          <span className="nav-label">Practice</span>
        </div>
        <div className="nav-item" onClick={() => scrollToSection('testimonials')}>
          <span className="nav-number">[04]</span>
          <span className="nav-label">Testimonials</span>
        </div>
        <div className="nav-item" onClick={() => scrollToSection('cta')}>
          <span className="nav-number">[05]</span>
          <span className="nav-label">Get Started</span>
        </div>
      </nav>

      {/* Hero Section */}
      <section id="hero" className="hero-section" data-section="hero" ref={heroRef}>
        <div className="hero-content">
          <div className="hero-text-wrapper">
            <div className="hero-subtitle">Creative Way of Learning/ Language Learning Specialist </div>
            
            <h1 className="hero-title">
              <span className="hero-line-1">LINGUA</span>
              <span className="hero-line-2">LEARN</span>
            </h1>

            <div className="tech-stack">
              <div className="tech-stack-wrapper">
                {techStack.map((tech, index) => {
                  const techClass = tech.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <span key={index} className={`tech-badge tech-badge-${techClass}`} data-tech={tech}>{tech}</span>
                  );
                })}
                {techStack.map((tech, index) => {
                  const techClass = tech.toLowerCase().replace(/\s+/g, '-');
                  return (
                    <span key={`duplicate-${index}`} className={`tech-badge tech-badge-${techClass}`} data-tech={tech}>{tech}</span>
                  );
                })}
              </div>
            </div>

            <div className="hero-actions">
              <button className="btn-primary" onClick={handleGetStarted}>
                <FaRocket />
                {user ? 'Go to Dashboard' : 'Start Learning Free'}
              </button>
              <button className="btn-secondary" onClick={handleTryDemo}>
                <FaPlay />
                Try Demo Lesson
              </button>
            </div>

            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="scroll-indicator" ref={scrollIndicatorRef}>
          <span>Scroll</span>
          <div className="scroll-line"></div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section" data-section="features">
        <div className="section-content">
          <div className="section-header">
            <span className="section-number">[02]</span>
            <h2>Why LinguaLearn<br />Stands Out</h2>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-card">
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice Types Section */}
      <section id="practice" className="practice-section" data-section="practice">
        <div className="section-content">
          <div className="section-header">
            <span className="section-number">[03]</span>
            <h2>Comprehensive<br />Learning Experience</h2>
          </div>
          
          <div className="practice-grid">
            {practiceTypes.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="practice-type-card">
                  <div className="practice-icon">
                    <Icon />
                  </div>
                  <h3>{practice.title}</h3>
                  <p>{practice.description}</p>
                  <ul className="practice-benefits">
                    <li><FaCheckCircle /> Real-time feedback</li>
                    <li><FaCheckCircle /> Personalized exercises</li>
                    <li><FaCheckCircle /> Progress tracking</li>
                  </ul>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="testimonials-section" data-section="testimonials">
        <div className="section-content">
          <div className="section-header">
            <span className="section-number">[04]</span>
            <h2>What Our<br />Learners Say</h2>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="author-avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <div className="author-name">{testimonial.name}</div>
                    <div className="author-role">{testimonial.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section id="cta" className="cta-section" data-section="cta">
        <div className="section-content">
          <div className="cta-content">
            <span className="section-number">[05]</span>
            <h2>Ready to Transform<br />Your English Skills?</h2>
            <p>Join LinguaLearn today and start your journey to fluency with our AI-powered platform</p>
            <div className="cta-features">
              <div className="feature">
                <FaShieldAlt />
                <span>7-day free trial</span>
              </div>
              <div className="feature">
                <FaGraduationCap />
                <span>Learn anywhere, anytime</span>
              </div>
              <div className="feature">
                <FaInfinity />
                <span>Cancel anytime</span>
              </div>
            </div>
            <div className="cta-actions">
              <button className="btn-primary large" onClick={handleGetStarted}>
                <FaRocket />
                Start Your Free Trial
              </button>
              <button className="btn-secondary large" onClick={handleTryDemo}>
                <FaPlay />
                Watch Product Tour
              </button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}