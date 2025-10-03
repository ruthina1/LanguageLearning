// frontend/src/pages/AITutor/AITutorChat.jsx
import React, { useState, useRef, useEffect } from 'react';
import { useAITutor } from '../../contexts/AITutorContext';
import { useAuth } from '../../contexts/AuthContext';
import MessageBubble from './MessageBubble';
import GrammarAssistant from './GrammarAssistant';
import PronunciationCoach from './PronunciationCoach';
import { 
  FaRobot, 
  FaComment, 
  FaEdit, 
  FaMicrophone, 
  FaTrash, 
  FaPaperPlane, 
  FaHourglassHalf,
  FaBook,
  FaLightbulb
} from 'react-icons/fa';
import './AITutorChat.css';

export default function AITutorChat () {
  const { conversation, isProcessing, sendMessage, clearConversation } = useAITutor();
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [conversation]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!message.trim()) return;

    await sendMessage(message);
    setMessage('');
  };

  const quickQuestions = [
    "Explain present perfect tense",
    "What's the difference between 'make' and 'do'?",
    "Help me with pronunciation of 'th' sounds",
    "Give me a conversation practice",
    "Correct this sentence for me"
  ];

  const renderChatInterface = () => (
    <div className="chat-interface">
      <div className="messages-container">
        {conversation.length === 0 ? (
          <div className="welcome-message">
            <div className="tutor-avatar"><FaRobot /></div>
            <div className="welcome-content">
              <h3>Hello! I'm ALEX, your AI English Tutor</h3>
              <p>I'm here to help you learn English. You can:</p>
              <ul>
                <li><FaComment /> Practice conversations</li>
                <li><FaEdit /> Get grammar corrections</li>
                <li><FaMicrophone /> Improve pronunciation</li>
                <li><FaBook /> Ask any English questions</li>
              </ul>
              <p>What would you like to work on today?</p>
            </div>
          </div>
        ) : (
         conversation.map((msg, index) => (
              <MessageBubble key={msg?.id || index} message={msg} />
          ))
        )}
        {isProcessing && (
          <div className="typing-indicator">
            <div className="tutor-avatar"><FaRobot /></div>
            <div className="typing-dots">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="quick-questions">
        <h4>Quick Questions:</h4>
        <div className="question-chips">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              className="question-chip"
              onClick={() => sendMessage(question)}
              disabled={isProcessing}
            >
              {question}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSendMessage} className="message-input-form">
        <div className="input-container">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask me anything about English..."
            disabled={isProcessing}
            className="message-input"
          />
          <button type="submit" disabled={isProcessing || !message.trim()} className="send-button">
            {isProcessing ? <FaHourglassHalf /> : <FaPaperPlane />}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="ai-tutor-page">
      <div className="tutor-header">
        <div className="header-content">
           
          <h1><FaRobot /> ALEX - AI English Tutor</h1>
          <p>Your personal English learning assistant</p>
        </div>
        <div className="header-actions">
          <button onClick={clearConversation} className="clear-chat-btn">
            <FaTrash /> Clear Chat
          </button>
        </div>
      </div>

      <div className="tutor-navigation">
        <button 
          className={`nav-btn ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <FaComment /> Chat Tutor
        </button>
        <button 
          className={`nav-btn ${activeTab === 'grammar' ? 'active' : ''}`}
          onClick={() => setActiveTab('grammar')}
        >
          <FaEdit /> Grammar Assistant
        </button>
        <button 
          className={`nav-btn ${activeTab === 'pronunciation' ? 'active' : ''}`}
          onClick={() => setActiveTab('pronunciation')}
        >
          <FaMicrophone /> Pronunciation Coach
        </button>
      </div>

      <div className="tutor-content">
        {activeTab === 'chat' && renderChatInterface()}
        {activeTab === 'grammar' && <GrammarAssistant />}
        {activeTab === 'pronunciation' && <PronunciationCoach />}
      </div>

      <div className="tutor-sidebar">
        <div className="user-progress">
          <h3>Your Progress</h3>
          <div className="progress-item">
            <span>Level {user?.progress.level}</span>
            <span>{user?.progress.xp} XP</span>
          </div>
          <div className="progress-item">
            <span>Current Streak</span>
            <span>{user?.progress.streak} days</span>
          </div>
        </div>

        <div className="tutor-tips">
          <h3><FaLightbulb /> Learning Tips</h3>
          <ul>
            <li>Practice daily for 15-30 minutes</li>
            <li>Don't be afraid to make mistakes</li>
            <li>Repeat difficult words aloud</li>
            <li>Use new vocabulary in sentences</li>
          </ul>
        </div>
      </div>
    </div>
  );
};