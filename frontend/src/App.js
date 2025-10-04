import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AITutorProvider } from './contexts/AITutorContext';  
import { SocialProvider } from './contexts/SocialContext';
import Navbar from './components/Layout/Navbar';
import Signup from './pages/Auth/Signup';
import Login from './pages/Auth/Login';
import Home from './pages/Home/Home';
import CourseTree from './pages/Lessons/CourseTree';
import LessonPage from './pages/Lessons/LessonPage';
import AITutorChat from './pages/AITutor/AITutorChat';
import CommunityFeed from './pages/Social/CommunityFeed';
import LevelComplete from './pages/Lessons/LevelComplete';

function AppContent() {
  const location = useLocation();
  const hideNavbarPaths = ['/login', '/signup','/lesson-complete'];
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
    </div>
  );
}
function App() {
  return (
    <Router>
      <AuthProvider>
        <SocialProvider> 
          <AppContent />
        </SocialProvider>
      </AuthProvider>
    </Router>
  );
}
export default App;
