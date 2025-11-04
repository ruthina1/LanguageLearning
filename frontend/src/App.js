import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AITutorProvider } from './contexts/AITutorContext';  
import { SocialProvider } from './contexts/SocialContext';
import { ChatbotProvider } from './contexts/ChatbotContext';
import Navbar from './components/Layout/Navbar';
import FloatingChatbot from './components/Chatbot/FloatingChatbot';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Home from './pages/Home/Home';
import CourseTree from './pages/Lessons/CourseTree';
import LessonPage from './pages/Lessons/LessonPage';
import AITutorChat from './pages/AITutor/AITutorChat';
import CommunityFeed from './pages/Social/CommunityFeed';
import LevelComplete from './pages/Lessons/LevelComplete';
import Dashboard from './pages/Dashboard/Dashboard';
import { ProgressProvider } from './contexts/ProgressContext';
import Profile from './pages/Profile/Profile';
import { UserProvider } from './contexts/UserContext'; 

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup','/lesson-complete','/home','/'];
  const showNavbar = !hideNavbarPaths.includes(location.pathname);

  return (
    <div className="App">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/lesson" element={<CourseTree />} />
        <Route path="/lesson-complete" element={<LevelComplete />} />
        <Route path="/lesson/:id" element={<LessonPage />} />
        <Route path="/community" element={<CommunityFeed />} />
         <Route path="/dashboard" element={<Dashboard />} />
         <Route path="/profile" element={<Profile />} />
        <Route 
          path="/ai-tutor" 
          element={
            <AITutorProvider>
              <AITutorChat />
            </AITutorProvider>
          } 
        />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      
      {/* Global Chatbot - Available on all pages except auth pages */}
      {!hideNavbarPaths.includes(location.pathname) && (
        <ChatbotProvider>
          <FloatingChatbot />
        </ChatbotProvider>
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocialProvider> 
        <ProgressProvider> 
          <UserProvider>
          <AppContent />
          </UserProvider>
           </ProgressProvider>
        </SocialProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;