import React, { useState, useRef, useEffect } from 'react';
import { useAITutor } from '../../contexts/AITutorContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import GrammarAssistant from './GrammarAssistant';
import PronunciationCoach from './PronunciationCoach';
import { 
  FaRobot, 
  FaPlus,
  FaTrash,
  FaPaperPlane,
  FaBars,
  FaEdit,
  FaMicrophone,
  FaComment
} from 'react-icons/fa';
import './AITutorChat.css';

export default function AITutorChat() {
  const { 
    currentConversation, 
    isProcessing, 
    sendMessage,
    clearConversation,
    startNewConversation,
    conversations,
    loadConversation
  } = useAITutor();
  
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('chat'); // 'chat', 'grammar', 'pronunciation'
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    try {
      await sendMessage(message, currentConversation?.id);
      setMessage('');
    } catch (error) {
      console.error('Failed to send message:', error);
    }
  };

  const handleClearChat = async () => {
    if (currentConversation) {
      await clearConversation(currentConversation.id);
    }
  };

  const handleNewChat = () => {
    startNewConversation();
    setCurrentView('chat');
  };

  const renderMainContent = () => {
    if (currentView === 'grammar') {
      return <GrammarAssistant />;
    }
    
    if (currentView === 'pronunciation') {
      return <PronunciationCoach />;
    }

    // Chat view - always show input
    return (
      <>
        <div className="messages-container">
          {(!currentConversation || currentConversation.messages.length === 0) ? (
            <div className="welcome-screen">
              <div className="welcome-icon">
                <FaRobot />
              </div>
              <h2>How can I help you today?</h2>
              <div className="welcome-actions">
                <button 
                  className="welcome-action-btn"
                  onClick={() => setCurrentView('grammar')}
                >
                  <FaEdit /> Grammar Assistant
                </button>
                <button 
                  className="welcome-action-btn"
                  onClick={() => setCurrentView('pronunciation')}
                >
                  <FaMicrophone /> Pronunciation Coach
                </button>
              </div>
            </div>
          ) : (
            <div className="messages-list">
              {currentConversation.messages.map((msg, index) => (
                <MessageBubble key={msg.id || index} message={msg} />
              ))}
              {isProcessing && (
                <div className="typing-indicator">
                  <div className="typing-dots">
                    <span></span>
                    <span></span>
                    <span></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          )}
        </div>

        {/* Input Area - Always visible in chat view */}
        <div className="input-area">
          <form onSubmit={handleSubmit} className="message-form">
            <div className="input-wrapper">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit(e);
                  }
                }}
                placeholder="Message ALEX..."
                disabled={isProcessing}
                rows="1"
                className="message-textarea"
              />
              <button 
                type="submit" 
                disabled={isProcessing || !message.trim()} 
                className="send-btn"
              >
                <FaPaperPlane />
              </button>
            </div>
          </form>
          <div className="input-footer">
            <p>ALEX can make mistakes. Check important info.</p>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="chatgpt-container">
      {/* Sidebar */}
      {sidebarOpen && (
        <div className="chatgpt-sidebar">
          <div className="sidebar-header">
            <button className="new-chat-btn" onClick={handleNewChat}>
              <FaPlus /> New chat
            </button>
          </div>

          {/* View Navigation */}
          <div className="view-navigation">
            <button 
              className={`view-nav-item ${currentView === 'chat' ? 'active' : ''}`}
              onClick={() => setCurrentView('chat')}
            >
              <FaComment /> Chat
            </button>
            <button 
              className={`view-nav-item ${currentView === 'grammar' ? 'active' : ''}`}
              onClick={() => setCurrentView('grammar')}
            >
              <FaEdit /> Grammar
            </button>
            <button 
              className={`view-nav-item ${currentView === 'pronunciation' ? 'active' : ''}`}
              onClick={() => setCurrentView('pronunciation')}
            >
              <FaMicrophone /> Pronunciation
            </button>
          </div>
          
          {/* Conversations List - only show in chat view */}
          {currentView === 'chat' && (
            <div className="conversations-list">
              {conversations.map(conv => (
                <div 
                  key={conv.id}
                  className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
                  onClick={() => loadConversation(conv.id)}
                >
                  <span className="conversation-text">{conv.title || 'New Conversation'}</span>
                  {currentConversation?.id === conv.id && (
                    <button 
                      className="delete-conv-btn"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleClearChat();
                      }}
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Main Chat Area */}
      <div className="chatgpt-main">
        {/* Top Bar */}
        <div className="chatgpt-topbar">
          <button 
            className="sidebar-toggle"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <FaBars />
          </button>
          <h1>ALEX</h1>
        </div>

        {/* Main Content */}
        <div className="main-content-area">
          {renderMainContent()}
        </div>
      </div>
    </div>
  );
}