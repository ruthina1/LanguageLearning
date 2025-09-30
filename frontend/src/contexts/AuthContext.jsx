import React, { createContext, useState, useContext, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext();

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      verifyToken(token);
    } else {
      setLoading(false);
    }
  }, []);

  const verifyToken = async (token) => {
    try {
      const result = await authAPI.verifyToken(token);
      if (result.success) {
        setCurrentUser(result.user);
      }
    } catch (error) {
      console.error('Token verification failed:', error);
      localStorage.removeItem('token');
    } finally {
      setLoading(false);
    }
  };

  const signup = async (userData) => {
    try {
      const result = await authAPI.register(userData);

      if (result.success) {
        localStorage.setItem('token', result.token);
        setCurrentUser(result.user);
        return result;
      } else {
        throw new Error(result.message || 'Registration failed');
      }
    } catch (error) {
      throw error;
    }
  };

   const login = async ({ username, password }) => {
  const result = await authAPI.login({ username, password });
  console.log('AuthContext login result:', result); // Debug log
  
  if (!result.success) {
    throw new Error(result.error || 'Login failed');
  }
  
  localStorage.setItem('token', result.token);
  setCurrentUser(result.user);
  return result;
};

  const logout = () => {
    localStorage.removeItem('token');
    setCurrentUser(null);
  };

  const value = {
    currentUser,
    signup,
    login,
    logout,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
