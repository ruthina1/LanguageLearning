import React from 'react';
import Message from './Message.jsx';
import { useChatbot } from '../../contexts/ChatbotContext.jsx';
import './ChatWindow.css';

const ChatWindow = () => {
  const { messages, isLoading, messagesEndRef } = useChatbot();

  return (
    <div className="chat-window">
      <div className="messages-container">
        {messages.length === 0 && (
          <div className="empty-state">
            <div className="welcome-icon">🤖</div>
            <h3>Welcome to AI Chatbot!</h3>
            <p>Start a conversation by sending a message below.</p>
          </div>
        )}
        
        {messages.map((message, index) => (
          <Message 
            key={index} 
            message={message} 
          />
        ))}
        
        {isLoading && (
          <div className="message bot-message loading">
            <div className="message-avatar">🤖</div>
            <div className="message-content">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
};

export default ChatWindow;