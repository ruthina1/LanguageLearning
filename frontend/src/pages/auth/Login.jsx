import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { FaEye, FaEyeSlash, FaLock, FaEnvelope, FaUser, FaKey } from 'react-icons/fa';
import { authAPI } from '../../services/api';
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
          }
        else {
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
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h2>Welcome Back!</h2>
          <p>Sign in to continue your language learning journey</p>
        </div>
        
     
        
        {error && <div className="error-message">{error}</div>}
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="username">
              <FaUser className="input-icon" />
              Username
            </label>
            <div className="password-input-container">
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
            className="auth-button"
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="button-loading">
                <div className="spinner"></div>
                <span>Signing In...</span>
              </div>
            ) : (
              <div className="button-content">
                <FaLock />
                <span>Sign In</span>
              </div>
            )}
          </button>
        </form>
        
        <div className="auth-links">
          <Link to="/signup" className="auth-link">
            Don't have an account? <strong>Sign up</strong>
          </Link>
          <Link to="/forgot-password" className="auth-link">
            Forgot your password?
          </Link>
        </div>
      </div>
    </div>
  );
}