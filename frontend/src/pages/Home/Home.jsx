// frontend/src/pages/Home/Home.jsx
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import {
  FaMicrophone, FaChartLine, FaTrophy, FaUsers, FaGlobe,
  FaComments, FaPenAlt, FaCheckCircle, FaArrowRight, FaQuoteLeft,
  FaRocket, FaPlay, FaGraduationCap, FaShieldAlt, FaInfinity, FaHeadphones,
  FaStar, FaChevronRight
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
      description: 'Real-time voice recognition technology provides instant feedback',
      image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=800&q=80',
      subtitle: 'Speak with Confidence'
    },
    {
      icon: FaChartLine,
      title: 'Personalized Learning Path',
      description: 'Adaptive algorithms create custom lessons based on your progress',
      image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800&q=80',
      subtitle: 'Your Journey, Your Pace'
    },
    {
      icon: FaTrophy,
      title: 'Gamified Experience',
      description: 'Earn XP, unlock achievements, and climb leaderboards',
      image: 'https://images.unsplash.com/photo-1551033406-611cf9a28f64?w=800&q=80',
      subtitle: 'Learn While You Play'
    }
  ];

  const practiceTypes = [
    {
      icon: FaMicrophone,
      title: 'Speaking Practice',
      description: 'Master pronunciation with advanced voice recognition',
      image: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80',
      color: '#d4a574',
      stats: '10K+ Lessons'
    },
    {
      icon: FaHeadphones,
      title: 'Listening Comprehension',
      description: 'Train your ear with authentic audio content',
      image: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
      color: '#b8926a',
      stats: '500+ Audio Files'
    },
    {
      icon: FaComments,
      title: 'Conversation Practice',
      description: 'Build confidence in real-life dialogues',
      image: 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=600&q=80',
      color: '#9b7f5a',
      stats: 'Live Sessions'
    },
    {
      icon: FaPenAlt,
      title: 'Writing Excellence',
      description: 'Perfect your writing with intelligent feedback',
      image: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&q=80',
      color: '#8a6f4a',
      stats: 'AI Feedback'
    }
  ];

  const testimonials = [
    {
      name: 'Maria Rodriguez',
      role: 'Business Professional',
      text: 'LinguaLearn transformed my business communication skills. In 3 months, I went from hesitant to confident in meetings.',
      image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80',
      rating: 5,
      location: 'New York, USA'
    },
    {
      name: 'David Chen',
      role: 'University Student',
      text: 'The personalized practice sessions helped me ace my TOEFL exam. The speaking exercises were incredibly effective!',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80',
      rating: 5,
      location: 'London, UK'
    },
    {
      name: 'Sarah Johnson',
      role: 'Travel Enthusiast',
      text: 'Finally I can travel and connect with people authentically. The cultural context in lessons makes all the difference.',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80',
      rating: 5,
      location: 'Sydney, Australia'
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

    // Feature showcase animations - Restaurant Gem style
    gsap.utils.toArray('.feature-showcase-item').forEach((item, index) => {
      const image = item.querySelector('.feature-image-container');
      const content = item.querySelector('.feature-content');
      
      gsap.set([image, content], { opacity: 1 });
      
      const isEven = index % 2 === 0;
      
      ScrollTrigger.create({
        trigger: item,
        start: 'top 80%',
        end: 'bottom 20%',
        onEnter: () => {
          gsap.fromTo(image, 
            { 
              x: isEven ? -100 : 100,
              opacity: 0,
              scale: 0.9
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1.2,
              ease: 'power3.out'
            }
          );
          gsap.fromTo(content,
            {
              x: isEven ? 100 : -100,
              opacity: 0
            },
            {
              x: 0,
              opacity: 1,
              duration: 1.2,
              delay: 0.2,
              ease: 'power3.out'
            }
          );
        }
      });
    });

    // Practice cards animation - smooth reveal
    gsap.utils.toArray('.practice-showcase-card').forEach((card, index) => {
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 80,
        opacity: 0,
        scale: 0.95,
        duration: 1,
        delay: index * 0.15,
        ease: 'power3.out'
      });
    });

    // Testimonial cards animation - staggered reveal
    gsap.utils.toArray('.testimonial-showcase-card').forEach((card, index) => {
      gsap.set(card, { opacity: 1, y: 0 });
      gsap.from(card, {
        scrollTrigger: {
          trigger: card,
          start: 'top 85%',
          toggleActions: 'play none none reverse'
        },
        y: 60,
        opacity: 0,
        scale: 0.9,
        duration: 0.9,
        delay: index * 0.1,
        ease: 'power3.out'
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

          <div className="features-showcase">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div key={index} className="feature-showcase-item">
                  <div className={`feature-image-wrapper ${index % 2 === 0 ? 'left' : 'right'}`}>
                    <div className="feature-image-container">
                      <img src={feature.image} alt={feature.title} className="feature-image" />
                      <div className="image-overlay"></div>
                    </div>
                  </div>
                  <div className={`feature-content-wrapper ${index % 2 === 0 ? 'right' : 'left'}`}>
                    <div className="feature-content">
                      <div className="feature-number">{String(index + 1).padStart(2, '0')}</div>
                      <span className="feature-subtitle">{feature.subtitle}</span>
                      <h3 className="feature-title-large">{feature.title}</h3>
                      <p className="feature-description-large">{feature.description}</p>
                      <div className="feature-icon-large">
                        <Icon />
                      </div>
                      <button className="feature-learn-more">
                        Learn More <FaChevronRight />
                      </button>
                    </div>
                  </div>
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

          <div className="practice-showcase">
            {practiceTypes.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div key={index} className="practice-showcase-card">
                  <div className="practice-card-image-wrapper">
                    <img src={practice.image} alt={practice.title} className="practice-card-image" />
                    <div className="practice-image-overlay"></div>
                    <div className="practice-icon-overlay">
                      <Icon />
                    </div>
                  </div>
                  <div className="practice-card-content">
                    <span className="practice-stats">{practice.stats}</span>
                    <h3 className="practice-card-title">{practice.title}</h3>
                    <p className="practice-card-description">{practice.description}</p>
                    <div className="practice-features-list">
                      <span className="practice-feature"><FaCheckCircle /> Real-time feedback</span>
                      <span className="practice-feature"><FaCheckCircle /> Personalized exercises</span>
                      <span className="practice-feature"><FaCheckCircle /> Progress tracking</span>
                    </div>
                  </div>
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

          <div className="testimonials-showcase">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-showcase-card">
                <div className="testimonial-image-wrapper">
                  <img src={testimonial.image} alt={testimonial.name} className="testimonial-image" />
                  <div className="testimonial-image-overlay"></div>
                </div>
                <div className="testimonial-content">
                  <div className="testimonial-rating">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <FaStar key={i} className="star-icon" />
                    ))}
                  </div>
                  <FaQuoteLeft className="quote-icon-large" />
                  <p className="testimonial-text-large">{testimonial.text}</p>
                  <div className="testimonial-author-info">
                    <div className="author-name-large">{testimonial.name}</div>
                    <div className="author-details">
                      <span className="author-role-large">{testimonial.role}</span>
                      <span className="author-location">{testimonial.location}</span>
                    </div>
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