// frontend/src/pages/Home/Home.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaRocket, 
  FaChartLine, 
  FaTrophy, 
  FaUsers, 
  FaGlobe, 
  FaMicrophone, 
  FaHeadphones,
  FaComments,
  FaPenAlt,
  FaStar,
  FaCheckCircle,
  FaPlay,
  FaArrowRight,
  FaQuoteLeft,
  FaMobile,
  FaGraduationCap,
  FaShieldAlt,
  FaInfinity
} from 'react-icons/fa';
import './Home.css';
import Navbar from '../../components/Layout/Navbar';

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [currentFeature, setCurrentFeature] = useState(0);

  const features = [
    {
      icon: FaMicrophone,
      title: 'AI-Powered Pronunciation',
      description: 'Real-time voice recognition technology provides instant feedback on your pronunciation accuracy'
    },
    {
      icon: FaChartLine,
      title: 'Personalized Learning Path',
      description: 'Adaptive algorithms create custom lessons based on your progress and weaknesses'
    },
    {
      icon: FaTrophy,
      title: 'Gamified Experience',
      description: 'Earn XP, unlock achievements, and climb leaderboards while mastering English'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Learners' },
    { number: '98%', label: 'Success Rate' },
    { number: '2.5M', label: 'Lessons Completed' },
    { number: '4.8/5', label: 'User Rating' }
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

  const practiceTypes = [
    {
      icon: FaMicrophone,
      title: 'Speaking Practice',
      description: 'Master pronunciation with advanced voice recognition',
      color: '#6a11cb'
    },
    {
      icon: FaHeadphones,
      title: 'Listening Comprehension',
      description: 'Train your ear with authentic audio content',
      color: '#2575fc'
    },
    {
      icon: FaComments,
      title: 'Conversation Practice',
      description: 'Build confidence in real-life dialogues',
      color: '#00b4db'
    },
    {
      icon: FaPenAlt,
      title: 'Writing Excellence',
      description: 'Perfect your writing with intelligent feedback',
      color: '#ff6b6b'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % features.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [features.length]);

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

  return (
    <div className="home-page">
      <section className="hero-section">
        <div className="hero-background">
          <div className="hero-overlay"></div>
        </div>
        <div className="hero-content">
          <div className="hero-text">
            <div className="badge">
              <FaStar className="badge-icon" />
              <span>Trusted by 50,000+ learners worldwide</span>
            </div>
            <h1>Master English with <span className="gradient-text">AI-Powered</span> Precision</h1>
            <p className="hero-description">
              LinguaLearn combines cutting-edge artificial intelligence with proven language learning methodologies 
              to deliver personalized English education that adapts to your unique learning style, pace, and goals.
            </p>
            <div className="hero-stats">
              {stats.map((stat, index) => (
                <div key={index} className="stat-item">
                  <div className="stat-number">{stat.number}</div>
                  <div className="stat-label">{stat.label}</div>
                </div>
              ))}
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
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <FaMicrophone />
              <span>Pronunciation: 95%</span>
            </div>
            <div className="floating-card card-2">
              <FaTrophy />
              <span>Level 5 Achieved!</span>
            </div>
            <div className="floating-card card-3">
              <FaChartLine />
              <span>+150 XP Today</span>
            </div>
            <div className="main-visual">
              <div className="visual-content">
                <div className="progress-ring">
                  <div className="progress-fill"></div>
                </div>
                <div className="visual-text">
                  <span>Fluency Progress</span>
                  <strong>78% Complete</strong>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <div className="container">
          <div className="section-header">
            <h2>Why LinguaLearn Stands Out</h2>
            <p>Experience the future of language learning with our innovative approach</p>
          </div>
          
          <div className="features-grid">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <div 
                  key={index} 
                  className={`feature-card ${index === currentFeature ? 'active' : ''}`}
                >
                  <div className="feature-icon">
                    <Icon />
                  </div>
                  <h3>{feature.title}</h3>
                  <p>{feature.description}</p>
                  <div className="feature-indicator"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Practice Types Section */}
      <section className="practice-section">
        <div className="container">
          <div className="section-header">
            <h2>Comprehensive Learning Experience</h2>
            <p>Develop all aspects of English proficiency through targeted practice</p>
          </div>
          
          <div className="practice-grid">
            {practiceTypes.map((practice, index) => {
              const Icon = practice.icon;
              return (
                <div 
                  key={index} 
                  className="practice-type-card"
                  style={{ '--accent-color': practice.color }}
                >
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

      {/* How It Works Section */}
      <section className="how-it-works">
        <div className="container">
          <div className="section-header">
            <h2>Your Journey to Fluency in 4 Steps</h2>
            <p>Simple, effective, and designed for real results</p>
          </div>
          
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-content">
                <h3>Assessment & Personalization</h3>
                <p>Complete our intelligent placement test to create your customized learning path</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-content">
                <h3>Interactive Learning</h3>
                <p>Engage with AI-powered lessons that adapt to your progress in real-time</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-content">
                <h3>Practice & Application</h3>
                <p>Apply your skills in realistic scenarios with instant feedback</p>
              </div>
            </div>
            
            <div className="step">
              <div className="step-number">04</div>
              <div className="step-content">
                <h3>Progress & Mastery</h3>
                <p>Track your improvement and achieve fluency milestones</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="testimonials-section">
        <div className="container">
          <div className="section-header">
            <h2>Success Stories from Our Learners</h2>
            <p>Join thousands who have transformed their English skills</p>
          </div>
          
          <div className="testimonials-grid">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="testimonial-card">
                <FaQuoteLeft className="quote-icon" />
                <p>{testimonial.text}</p>
                <div className="testimonial-author">
                  <div className="avatar">{testimonial.avatar}</div>
                  <div className="author-info">
                    <strong>{testimonial.name}</strong>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-content">
            <h2>Ready to Transform Your English Skills?</h2>
            <p>Join LinguaLearn today and start your journey to fluency with our AI-powered platform</p>
            <div className="cta-features">
              <div className="feature">
                <FaShieldAlt />
                <span>7-day free trial</span>
              </div>
              <div className="feature">
                <FaMobile />
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