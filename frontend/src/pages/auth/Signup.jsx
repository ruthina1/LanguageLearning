// frontend/src/pages/Auth/Signup.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaGlobe, FaArrowRight } from 'react-icons/fa';
import { authAPI } from '../../services/api';
import { gsap } from 'gsap';
import './Auth.css';

export default function Signup() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirm_password: '',
    native_language: 'am',
    target_language: 'en'
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { signup } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Animation on mount
    gsap.from('.signup-image-wrapper', {
      x: -100,
      opacity: 0,
      duration: 1.2,
      ease: 'power3.out'
    });
    gsap.from('.signup-form-wrapper', {
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
    // Validation
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }
    
    if (formData.password.length < 6) {
      return setError('Password must be at least 6 characters');
    }

    setIsLoading(true);
    setError('');

    try {
      const res = await authAPI.register(formData);

      if (res.success) {
        setSuccess('Account created successfully!');
        navigate('/login');
      } else {
        setError(res.error || 'Registration failed');
      }
    } catch (err) {
      setError('Registration failed');
    } finally {
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="auth-page signup-page">
      <div className="auth-split-container">
        {/* Left Side - Image */}
        <div className="signup-image-wrapper">
          <div className="auth-image-container">
            <img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&q=80" 
              alt="Language Learning" 
              className="auth-image"
            />
            <div className="auth-image-overlay"></div>
            <div className="auth-image-content">
              <h1 className="auth-image-title">Start Your Journey</h1>
              <p className="auth-image-subtitle">Join thousands of learners mastering new languages</p>
              <div className="auth-features">
                <div className="auth-feature-item">
                  <FaUser />
                  <span>Personalized Learning</span>
                </div>
                <div className="auth-feature-item">
                  <FaGlobe />
                  <span>Multiple Languages</span>
                </div>
                <div className="auth-feature-item">
                  <FaLock />
                  <span>Secure & Private</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="signup-form-wrapper">
          <div className="auth-form-card">
            <div className="auth-form-header">
              <span className="auth-form-number">[01]</span>
              <h2>Create Account</h2>
              <p>Begin your language learning adventure</p>
            </div>
            
            {error && <div className="error-message">{error}</div>}
            {success && <div className="success-message">{success}</div>}
            
            <form onSubmit={handleSubmit} className="auth-form">
              <div className="form-group">
                <label>
                  <FaUser className="input-icon" />
                  Username
                </label>
                <input
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                  minLength="3"
                  placeholder="Choose a username"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FaEnvelope className="input-icon" />
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="your@email.com"
                />
              </div>
              
              <div className="form-group">
                <label>
                  <FaLock className="input-icon" />
                  Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="At least 6 characters"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-group">
                <label>
                  <FaLock className="input-icon" />
                  Confirm Password
                </label>
                <div className="password-input-container">
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirm_password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    required
                    minLength="6"
                    placeholder="Re-enter your password"
                  />
                  <button 
                    type="button" 
                    className="password-toggle"
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              
              <div className="form-row">
                <div className="form-group">
                  <label>
                    <FaGlobe className="input-icon" />
                    Native Language
                  </label>
                  <select name="native_language" value={formData.native_language} onChange={handleChange}>
                    <option value="am">Amharic</option>
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>
                    <FaGlobe className="input-icon" />
                    Target Language
                  </label>
                  <select name="target_language" value={formData.target_language} onChange={handleChange}>
                    <option value="en">English</option>
                    <option value="am">Amharic</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                  </select>
                </div>
              </div>
              
              <button type="submit" className="auth-submit-btn" disabled={isLoading}>
                {isLoading ? (
                  <span>Creating Account...</span>
                ) : (
                  <>
                    <span>Create Account</span>
                    <FaArrowRight />
                  </>
                )}
              </button>
            </form>
            
            <div className="auth-links">
              <p>Already have an account? <Link to="/login" className="auth-link">Sign In</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}