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
  FaLightbulb,
  FaPlus
} from 'react-icons/fa';
import './AITutorChat.css';

export default function AITutorChat() {
  const { 
    currentConversation, 
    isProcessing, 
    sendMessage,  // This is from your context
    clearConversation,
    startNewConversation,
    conversations,
    loadConversation
  } = useAITutor();
  
  const { user } = useAuth();
  const [message, setMessage] = useState('');
  const [activeTab, setActiveTab] = useState('chat');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentConversation?.messages]);

  // REMOVE THIS DUPLICATE FUNCTION - You already have sendMessage from context
  // const handleSendMessage = async (messageText, currentConversationId = null) => {
  //   try {
  //     const response = await aiTutorAPI.sendMessage({
  //       message: messageText,
  //       conversationId: currentConversationId,
  //       sender: 'user'
  //     });
  //     return response.data;
  //   } catch (error) {
  //     console.error('Failed to send message:', error);
  //     throw error;
  //   }
  // };

  // CORRECTED: Form submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message.trim() || isProcessing) return;

    try {
      console.log('📤 Sending message:', message, 'to conversation:', currentConversation?.id);
      await sendMessage(message, currentConversation?.id);
      setMessage(''); // Clear input after sending
    } catch (error) {
      console.error('❌ Failed to send message:', error);
      // You might want to show an error message to the user here
    }
  };

  const handleClearChat = async () => {
    if (currentConversation) {
      await clearConversation(currentConversation.id);
    }
  };

  const handleNewChat = () => {
    startNewConversation();
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
      {/* Conversation Sidebar */}
      <div className="conversation-sidebar">
        <div className="conversation-list">
          {conversations.map(conv => (
            <div 
              key={conv.id}
              className={`conversation-item ${currentConversation?.id === conv.id ? 'active' : ''}`}
              onClick={() => loadConversation(conv.id)}
            >
              <div className="conversation-title">{conv.title}</div>
              <div className="conversation-preview">
                {conv.last_message || 'No messages yet'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="chat-main">
        <div className="messages-container">
          {(!currentConversation || currentConversation.messages.length === 0) ? (
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
            currentConversation.messages.map((msg, index) => (
              <MessageBubble key={msg.id || index} message={msg} />
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

        <form onSubmit={handleSubmit} className="message-input-form">
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
          {currentConversation && (
            <button onClick={handleClearChat} className="clear-chat-btn">
              <FaTrash /> Clear Chat
            </button>
          )}
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
          <h3>Your AI Progress</h3>
          <div className="progress-item">
            <span>Level {user?.aiProgress?.level || 1}</span>
            <span>{user?.aiProgress?.xp || 0} XP</span>
          </div>
          <div className="progress-item">
            <span>Current Streak</span>
            <span>{user?.aiProgress?.streak || 0} days</span>
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
}