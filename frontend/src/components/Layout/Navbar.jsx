import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import './Navbar.css';
import { 
  FaBullseye
} from 'react-icons/fa';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, logout } = useAuth();

  const isHomePage = location.pathname === '/' || location.pathname === '/home';
  const isAuthPage = location.pathname === '/login' || location.pathname === '/signup';

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  // Hide navbar completely on auth pages
  if (isAuthPage) return null;

  return (
    <nav className="navbar">
      {/* Left side */}
      <div className="navbar-left" onClick={() => navigate('/')}>
        <FaBullseye className="logo-icon" />
        <span className="navbar-title">LinguaLearn</span>
      </div>

      {/* Right side */}
      <div className="navbar-right">
        {isHomePage ? (
          <>
            <Link to="/login" className="nav-btn login-btn">Login</Link>
            <Link to="/signup" className="nav-btn signup-btn">Sign Up</Link>
          </>
        ) : (
          <>
            <Link to="/lesson" className="nav-link">Lesson</Link>
            <Link to="/dashboard" className="nav-link">Dashboard</Link>
            <Link to="/ai-tutor" className="nav-link">AI Tutor</Link>
            <Link to="/community" className="nav-link">Community</Link>
            <button onClick={handleLogout} className="nav-btn logout-btn">Logout</button>

            {/* Profile circle always visible for logged-in users */}
            {currentUser && (
              <Link to="/profile" className="profile-circle" title={currentUser.email || 'Profile'}>
                {currentUser.email ? currentUser.email[0].toUpperCase() : 'U'}
              </Link>
            )}
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
