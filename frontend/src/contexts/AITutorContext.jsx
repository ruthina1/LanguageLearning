import React, { createContext, useContext, useState, useEffect } from 'react';
import { aiTutorAPI } from '../services/api';
import { useAuth } from './AuthContext';

const AITutorContext = createContext();

export const AITutorProvider = ({ children }) => {
  const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [currentConversation, setCurrentConversation] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [currentAnalysis, setCurrentAnalysis] = useState(null);
  const [pronunciationEvaluation, setPronunciationEvaluation] = useState(null);
  const [aiProgress, setAiProgress] = useState(null);
  const [error, setError] = useState(null); // Add error state

  // Load user's AI progress
  useEffect(() => {
    if (user) {
      loadAIProgress();
      loadConversations();
    }
  }, [user]);

  const loadAIProgress = async () => {
    try {
      const response = await aiTutorAPI.getAIStats();
      setAiProgress(response.data);
    } catch (error) {
      console.error('Failed to load AI progress:', error);
    }
  };

  const loadConversations = async () => {
    try {
      const response = await aiTutorAPI.getConversations();
      setConversations(response.data);
    } catch (error) {
      console.error('Failed to load conversations:', error);
    }
  };

  const loadConversation = async (conversationId) => {
    try {
      const response = await aiTutorAPI.getConversation(conversationId);
      setCurrentConversation(response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to load conversation:', error);
      throw error;
    }
  };

  // In AITutorContext.jsx - update the sendMessage function
  const sendMessage = async (messageText, conversationId = null) => {
    try {
      setIsProcessing(true);
      
      console.log('📤 Context: Sending message via API');
      const response = await aiTutorAPI.sendMessage({
        message: messageText,
        conversationId: conversationId
      });
      
      console.log('✅ Context: Message sent successfully', response.data);
      
      const { 
        success, 
        conversationId: newConversationId, 
        userMessageId, 
        assistantMessageId, 
        aiResponse 
      } = response.data;
      
      if (success) {
        console.log('🔄 Context: Updating state with new data');
        
        // If this is a new conversation
        if (!conversationId) {
          console.log('🆕 Creating new conversation in state');
          
          // Create new conversation object
          const newConversation = {
            id: newConversationId,
            title: messageText.substring(0, 50) + '...',
            messages: [
              {
                id: userMessageId,
                text: messageText,
                sender: 'user',
                created_at: new Date().toISOString()
              },
              {
                id: assistantMessageId,
                text: aiResponse.response,
                sender: 'assistant',
                amharic_translation: aiResponse.amharicTranslation,
                pronunciation_tips: aiResponse.pronunciationTips,
                grammar_corrections: aiResponse.grammarCorrections,
                created_at: new Date().toISOString()
              }
            ]
          };
          
          // Update conversations list and set current conversation
          setConversations(prev => [newConversation, ...prev]);
          setCurrentConversation(newConversation);
          
        } else {
          // Existing conversation - add messages to current conversation
          console.log('📝 Adding messages to existing conversation');
          
          setCurrentConversation(prev => {
            if (!prev) return prev;
            
            return {
              ...prev,
              messages: [
                ...prev.messages,
                {
                  id: userMessageId,
                  text: messageText,
                  sender: 'user',
                  created_at: new Date().toISOString()
                },
                {
                  id: assistantMessageId,
                  text: aiResponse.response,
                  sender: 'assistant',
                  amharic_translation: aiResponse.amharicTranslation,
                  pronunciation_tips: aiResponse.pronunciationTips,
                  grammar_corrections: aiResponse.grammarCorrections,
                  created_at: new Date().toISOString()
                }
              ]
            };
          });
          
          // Also update the conversation in the conversations list
          setConversations(prev => 
            prev.map(conv => 
              conv.id === conversationId 
                ? { 
                    ...conv, 
                    messages: [
                      ...conv.messages,
                      {
                        id: userMessageId,
                        text: messageText,
                        sender: 'user',
                        created_at: new Date().toISOString()
                      },
                      {
                        id: assistantMessageId,
                        text: aiResponse.response,
                        sender: 'assistant',
                        amharic_translation: aiResponse.amharicTranslation,
                        pronunciation_tips: aiResponse.pronunciationTips,
                        grammar_corrections: aiResponse.grammarCorrections,
                        created_at: new Date().toISOString()
                      }
                    ]
                  }
                : conv
            )
          );
        }
        
        console.log('✅ Context: State updated successfully');
      }
      
      return response.data;
    } catch (error) {
      console.error('❌ Context: Failed to send message', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // In your AITutorContext.jsx - update analyzeGrammar function
  const analyzeGrammar = async (text) => {
    try {
      setIsProcessing(true);
      console.log('📤 Context: Sending grammar analysis request');
      
      const response = await aiTutorAPI.analyzeGrammar(text);
      console.log('✅ Context: Grammar analysis successful:', response.data);
      
      setCurrentAnalysis(response.data);
      return response.data;
    } catch (error) {
      console.error('❌ Context: Grammar analysis failed:', error);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  // FIXED: Use aiTutorAPI instead of direct api.post
  const evaluatePronunciation = async (spokenText, targetText, audioUrl = null) => {
    try {
      setIsProcessing(true);
      setError(null);
      
      console.log('🎯 Context: Sending pronunciation evaluation request:', {
        spokenText, targetText, audioUrl
      });

      // Use aiTutorAPI instead of direct api.post
      const response = await aiTutorAPI.evaluatePronunciation({
        spokenText,
        targetText,
        audioUrl
      });

      console.log('✅ Context: Pronunciation evaluation response:', response.data);

      if (response.data.success) {
        setPronunciationEvaluation(response.data.data);
        return response.data.data;
      } else {
        throw new Error(response.data.message || 'Failed to evaluate pronunciation');
      }
    } catch (error) {
      console.error('❌ Context: Pronunciation evaluation error:', error);
      setError(error.message);
      throw error;
    } finally {
      setIsProcessing(false);
    }
  };

  const clearConversation = async (conversationId = null) => {
    try {
      if (conversationId) {
        await aiTutorAPI.clearConversation(conversationId);
        if (currentConversation && currentConversation.id === conversationId) {
          await loadConversation(conversationId);
        }
      } else if (currentConversation) {
        await aiTutorAPI.clearConversation(currentConversation.id);
        await loadConversation(currentConversation.id);
      }
    } catch (error) {
      console.error('Failed to clear conversation:', error);
      throw error;
    }
  };

  const deleteConversation = async (conversationId) => {
    try {
      await aiTutorAPI.deleteConversation(conversationId);
      setConversations(prev => prev.filter(conv => conv.id !== conversationId));
      
      if (currentConversation && currentConversation.id === conversationId) {
        setCurrentConversation(null);
      }
    } catch (error) {
      console.error('Failed to delete conversation:', error);
      throw error;
    }
  };

  const startNewConversation = () => {
    setCurrentConversation(null);
  };

  const value = {
    // Chat
    conversations,
    currentConversation,
    isProcessing,
    sendMessage,
    clearConversation,
    deleteConversation,
    loadConversation,
    startNewConversation,
    loadConversations,
    
    // Grammar
    currentAnalysis,
    analyzeGrammar,
    
    // Pronunciation
    pronunciationEvaluation,
    evaluatePronunciation,
    
    // Progress
    aiProgress,
    
    // Error
    error
  };

  return (
    <AITutorContext.Provider value={value}>
      {children}
    </AITutorContext.Provider>
  );
};

export const useAITutor = () => {
  const context = useContext(AITutorContext);
  if (!context) {
    throw new Error('useAITutor must be used within an AITutorProvider');
  }
  return context;
};