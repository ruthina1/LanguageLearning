import React from 'react';
import { FaRobot, FaTrash, FaTimes, FaCommentDots } from 'react-icons/fa';
import { useChatbot } from '../../contexts/ChatbotContext.jsx';
import ChatWindow from './ChatWindow.jsx';
import MessageInput from './MessageInput.jsx';
import './FloatingChatbot.css';

const FloatingChatbot = () => {
  const { 
    isChatOpen, 
    toggleChat, 
    clearChat,
    messages 
  } = useChatbot();

  return (
    <div className="floating-chatbot-container">
      {isChatOpen && (
        <div className="chatbot-window">
          <div className="chatbot-header">
            <div className="chatbot-title">
              <span className="chatbot-avatar">
                <FaRobot size={24} />
              </span>
              <div className="chatbot-info">
                <h3>AI Assistant</h3>
                <div className="status">
                  <span className="status-dot"></span>
                  <span className="status-text">Online</span>
                </div>
              </div>
            </div>
            <div className="chatbot-actions">
              <button 
                className="action-btn clear-btn"
                onClick={clearChat}
                disabled={messages.length === 0}
                title="Clear chat"
              >
                <FaTrash size={18} />
              </button>
              <button 
                className="action-btn close-btn"
                onClick={toggleChat}
                title="Close chat"
              >
                <FaTimes size={18} />
              </button>
            </div>
          </div>

          <div className="chat-area">
            <ChatWindow />
            <MessageInput />
          </div>
        </div>
      )}

      <button 
        className={`floating-chat-button ${isChatOpen ? 'hidden' : ''}`}
        onClick={toggleChat}
      >
        <FaCommentDots size={24} className="chat-icon" />
        <span className="notification-dot"></span>
      </button>
    </div>
  );
};

export default FloatingChatbot;
