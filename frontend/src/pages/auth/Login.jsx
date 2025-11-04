import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaKey, FaArrowRight } from 'react-icons/fa';
import { authAPI } from '../../services/api';
import { gsap } from 'gsap';
import './Auth.css';

export default function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Animation on mount
    gsap.from('.login-image-wrapper', {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
    gsap.from('.login-form-wrapper', {
      x: 100,
      opacity: 0,
      duration: 1.2,
      delay: 0.2,
      ease: 'power3.out'
    });
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await authAPI.login(formData);
      
      if (result.success) {
        await login({ token: result.token, user: result.user });
        navigate('/lesson');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      console.error('Login error details:', err); 
      setError(err.message || 'Failed to log in. Please check your credentials.');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-page login-page">
      <div className="auth-split-container">
        {/* Left Side - Image */}
        <div className="login-image-wrapper">
          <div className="auth-image-container">
            <img 
              src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80" 
              alt="Welcome Back" 
              className="auth-image"
            />
            <div className="auth-image-overlay"></div>
            <div className="auth-image-content">
              <h1 className="auth-image-title">Welcome Back!</h1>
              <p className="auth-image-subtitle">Continue your language learning journey</p>
              <div className="auth-features">
                <div className="auth-feature-item">
                  <FaUser />
                  <span>Track Your Progress</span>
                </div>
                <div className="auth-feature-item">
                  <FaKey />
                  <span>Personalized Lessons</span>
                </div>
                <div className="auth-feature-item">
                  <FaLock />
                  <span>Secure Access</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="login-form-wrapper">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <span className="auth-form-number">[02]</span>
              <h2>Sign In</h2>
              <p>Access your personalized learning dashboard</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label htmlFor="username">
                  <FaUser className="input-icon" />
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  placeholder="Enter your username"
                  required
                  disabled={isLoading}
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="password">
                  <FaLock className="input-icon" />
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    required
                    disabled={isLoading}
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                    disabled={isLoading}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
                      
              <button 
                type="submit" 
                className="auth-submit-btn"
                disabled={isLoading}
              >
                {isLoading ? (
                  <span>Signing In...</span>
                ) : (
                  <>
                    <span>Sign In</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-links">
              <p>Don't have an account? <Link to="/signup" className="auth-link">Sign Up</Link></p>
              <Link to="/forgot-password" className="auth-link forgot-link">
                Forgot your password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}