import React, { createContext, useState, useContext, useRef, useEffect } from 'react';

const ChatbotContext = createContext();

export const useChatbot = () => {
  const context = useContext(ChatbotContext);
  if (!context) {
    throw new Error('useChatbot must be used within a ChatbotProvider');
  }
  return context;
};

export const ChatbotProvider = ({ children }) => {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);


 const sendMessage = async (text) => {
  const userMessage = { sender: 'user', text };
  setMessages((prev) => [...prev, userMessage]);

  try {
    const response = await fetch('http://localhost:5000/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: text 
      })
    });

    const data = await response.json();
    console.log('Chatbot reply:', data);

    const botMessage = { sender: 'bot', text: data.reply };
    setMessages((prev) => [...prev, botMessage]);

  } catch (error) {
    console.error('Error sending message:', error);
  }
};

  const clearChat = () => {
    setMessages([]);
  };

  const toggleChat = () => {
    setIsChatOpen(prev => !prev);
  };

  const value = {
    messages,
    isLoading,
    isChatOpen,
    messagesEndRef,
    sendMessage,
    clearChat,
    toggleChat,
    setIsChatOpen
  };

  return (
    <ChatbotContext.Provider value={value}>
      {children}
    </ChatbotContext.Provider>
  );
};

export default ChatbotContext;