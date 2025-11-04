import React, { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initializeUser();
  }, []);

  const initializeUser = () => {
    try {
      const token = localStorage.getItem('token');
      console.log('UserContext - Token found:', !!token);
      
      if (token) {
        const decodedToken = jwtDecode(token);
        console.log('UserContext - Decoded token:', decodedToken);
        
        setUser({
          id: decodedToken.userId,
          username: decodedToken.username
        });
        console.log('UserContext - User set successfully');
      } else {
        console.log('UserContext - No token found');
      }
    } catch (error) {
      console.error('UserContext - Error initializing user:', error);
    } finally {
      setLoading(false);
      console.log('UserContext - Initialization complete');
    }
  };

  const refreshUser = () => {
    initializeUser();
  };

  const value = {
    user,
    loading,
    refreshUser
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};