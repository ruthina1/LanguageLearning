// frontend/src/components/Layout/Navbar.jsx
import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { 
  FaBullseye, FaHome, FaBook, FaRobot, FaTrophy, FaUsers, FaUser, 
  FaSignOutAlt, FaSignInAlt, FaUserPlus, FaBars, FaTimes, 
  FaStar, FaUserFriends, FaChevronDown
} from 'react-icons/fa';
import './Navbar.css';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
    setOpenDropdown(null);
  };

  const toggleDropdown = (dropdown) => {
    setOpenDropdown(openDropdown === dropdown ? null : dropdown);
  };

  const isActiveLink = (path) => location.pathname === path ? 'active' : '';
  const isHomeRoute = location.pathname === '/' || location.pathname === '/home';

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="nav-logo" onClick={closeMenu}>
          <FaBullseye className="logo-icon" />
          <span className="logo-text">LinguaLearn</span>
        </Link>

        <div className={`nav-menu ${isMenuOpen ? 'active' : ''}`}>
          {!isHomeRoute && (
            <>
              <Link 
                to="/dashboard" 
                className={`nav-link ${isActiveLink('/dashboard')}`}
                onClick={closeMenu}
              >
                <FaHome className="nav-icon" />
                <span>Dashboard</span>
              </Link>
              <Link 
                to="/lesson" 
                className={`nav-link ${isActiveLink('/lesson')}`}
                onClick={closeMenu}
              >
                <FaBook className="nav-icon" />
                <span>Lessons</span>
              </Link>
              <Link 
                to="/ai-tutor" 
                className={`nav-link ${isActiveLink('/ai-tutor')}`}
                onClick={closeMenu}
              >
                <FaRobot className="nav-icon" />
                <span>AI Tutor</span>
              </Link>

              {/* Social Dropdown */}
              <div className={`nav-dropdown ${openDropdown === 'social' ? 'open' : ''}`}>
                <button 
                  className="dropdown-toggle" 
                  onClick={() => toggleDropdown('social')}
                >
                  <FaUsers className="nav-icon" />
                  <span>Social</span>
                  <FaChevronDown className="dropdown-arrow" />
                </button>
                {openDropdown === 'social' && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/leaderboard" 
                      className={`dropdown-link ${isActiveLink('/leaderboard')}`}
                      onClick={closeMenu}
                    >
                      <FaTrophy className="nav-icon" />
                      <span>Leaderboard</span>
                    </Link>
                    <Link 
                      to="/friends" 
                      className={`dropdown-link ${isActiveLink('/friends')}`}
                      onClick={closeMenu}
                    >
                      <FaUserFriends className="nav-icon" />
                      <span>Friends</span>
                    </Link>
                    <Link 
                      to="/community" 
                      className={`dropdown-link ${isActiveLink('/community')}`}
                      onClick={closeMenu}
                    >
                      <FaUsers className="nav-icon" />
                      <span>Community</span>
                    </Link>
                  </div>
                )}
              </div>

              {/* Progress Dropdown */}
              <div className={`nav-dropdown ${openDropdown === 'progress' ? 'open' : ''}`}>
                <button 
                  className="dropdown-toggle" 
                  onClick={() => toggleDropdown('progress')}
                >
                  <FaStar className="nav-icon" />
                  <span>Progress</span>
                  <FaChevronDown className="dropdown-arrow" />
                </button>
                {openDropdown === 'progress' && (
                  <div className="dropdown-menu">
                    <Link 
                      to="/achievements" 
                      className={`dropdown-link ${isActiveLink('/achievements')}`}
                      onClick={closeMenu}
                    >
                      <FaStar className="nav-icon" />
                      <span>Achievements</span>
                    </Link>
                  </div>
                )}
              </div>
            </>
          )}

          {/* User Auth Section */}
          {user ? (
            <div className="nav-user">
              <Link 
                to="/profile" 
                className="profile-circle"
                onClick={closeMenu}
              >
                {user.profile?.avatar || <FaUser />}
              </Link>
              <button onClick={handleLogout} className="logout-btn">
                <FaSignOutAlt className="logout-icon" />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            isHomeRoute && (
              <div className="nav-auth">
                <Link 
                  to="/login" 
                  className={`nav-link ${isActiveLink('/login')}`}
                  onClick={closeMenu}
                >
                  <FaSignInAlt className="nav-icon" />
                  <span>Login</span>
                </Link>
                <Link 
                  to="/signup" 
                  className={`nav-link signup-btn ${isActiveLink('/signup')}`}
                  onClick={closeMenu}
                >
                  <FaUserPlus className="nav-icon" />
                  <span>Sign Up</span>
                </Link>
              </div>
            )
          )}
        </div>

        {/* Mobile Toggle */}
        <button 
          className="nav-toggle"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>
      </div>
    </nav>
  );
}
