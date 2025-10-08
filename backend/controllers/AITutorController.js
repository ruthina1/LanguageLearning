import AITutorModel from '../models/aitutorModel.js';
import AIService from '../services/aiService.js';
import AIProgressModel from '../models/AIProgressModel.js';
import pool from '../config/db.js';

class AITutorController {

  static async getUserConversations(req, res) {
    try {
      const userId = req.user.id;
      const conversations = await AITutorModel.getUserConversations(userId);
      res.json({ success: true, data: conversations });
    } catch (error) {
      console.error('Error getting conversations:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch conversations.' });
    }
  }

  static async createConversation(req, res) {
    try {
      const userId = req.user.id;
      const { title } = req.body;
      const conversation = await AITutorModel.createConversation(userId, title);
      res.json({ success: true, data: conversation });
    } catch (error) {
      console.error('Error creating conversation:', error);
      res.status(500).json({ success: false, message: 'Failed to create conversation.' });
    }
  }

static async addMessage(req, res) {
  try {
    console.log('🎯 Add Message Controller - Start');
    console.log('📝 Request body:', req.body);
    console.log('👤 Authenticated user:', req.user);

    const userId = req.user.id;
    const { conversationId, message, sender = 'user' } = req.body;

    console.log('🔍 Parsed parameters:', {
      userId,
      conversationId,
      message,
      sender
    });

    // Validate required fields
    if (!message || message.trim().length === 0) {
      console.log('❌ Validation failed: message is empty');
      return res.status(400).json({ 
        success: false, 
        message: 'Message is required' 
      });
    }

    let currentConversationId = conversationId;

    // Create new conversation if no ID provided
    if (!currentConversationId) {
      console.log('🆕 Creating new conversation');
      const newConversation = await AITutorModel.createConversation(userId, message.substring(0, 50) + '...');
      currentConversationId = newConversation.id;
      console.log('✅ Created conversation:', currentConversationId);
    } else {
      // Validate ownership
      console.log('🔍 Validating conversation ownership:', currentConversationId);
      const conversation = await AITutorModel.getConversationById(currentConversationId, userId);
      if (!conversation) {
        console.log('❌ Conversation access denied');
        return res.status(403).json({ 
          success: false, 
          message: 'Access denied.' 
        });
      }
      console.log('✅ Conversation ownership validated');
    }

    // Save user message
    console.log('💾 Saving user message');
    const userMessageId = await AITutorModel.addMessage(currentConversationId, message, sender);
    console.log('✅ User message saved:', userMessageId);
    
    // Generate AI response
    console.log('🤖 Generating AI response');
    const conversationHistory = await AITutorModel.getMessages(currentConversationId);
    console.log('📜 Conversation history length:', conversationHistory.length);
    
    const aiResponse = await AIService.generateChatResponse(message, conversationHistory);
    console.log('✅ AI response generated:', aiResponse);
    
    // Save AI response
    console.log('💾 Saving AI response');
    const assistantMessageId = await AITutorModel.addMessage(
      currentConversationId, 
      aiResponse.response, 
      'assistant'
    );
    console.log('✅ AI message saved:', assistantMessageId);

    // Update timestamp
    console.log('⏰ Updating conversation timestamp');
    await pool.execute(
      'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [currentConversationId]
    );

    // Update progress
    console.log('📊 Updating user progress');
    await AIProgressModel.incrementAISessionCount(userId, 'chat');
    await AIProgressModel.addAIXP(userId, 5);

    console.log('🎉 Message processing completed successfully');

    res.json({ 
      success: true, 
      conversationId: currentConversationId,
      userMessageId,
      assistantMessageId,
      aiResponse
    });
  } catch (error) {
    console.error(' Error in addMessage:', {
      message: error.message,
      stack: error.stack,
      body: req.body
    });
    res.status(500).json({ 
      success: false, 
      message: 'Failed to add message.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}

  static async getMessages(req, res) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;
      
      const conversation = await AITutorModel.getConversationById(conversationId, userId);
      if (!conversation) {
        return res.status(403).json({ success: false, message: 'Access denied.' });
      }

      const messages = await AITutorModel.getMessages(conversationId);
      res.json({ success: true, data: messages });
    } catch (error) {
      console.error('Error fetching messages:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch messages.' });
    }
  }

  static async clearConversation(req, res) {
    try {
      const userId = req.user.id;
      const { conversationId } = req.params;
      await AITutorModel.clearConversation(conversationId, userId);
      res.json({ success: true, message: 'Conversation cleared.' });
    } catch (error) {
      console.error('Error clearing conversation:', error);
      res.status(500).json({ success: false, message: 'Failed to clear conversation.' });
    }
  }

  static async saveGrammarAnalysis(req, res) {
    try {
      const userId = req.user.id;
      const { analysis } = req.body;

      const grammarAnalysisId = await AITutorModel.saveGrammarAnalysis(userId, analysis);

      if (analysis.errors) {
        await AITutorModel.saveGrammarErrors(grammarAnalysisId, analysis.errors);
      }

      if (analysis.improvementTips) {
        await AITutorModel.saveImprovementTips(grammarAnalysisId, analysis.improvementTips);
      }

      res.json({ success: true, grammarAnalysisId });
    } catch (error) {
      console.error('Error saving grammar analysis:', error);
      res.status(500).json({ success: false, message: 'Failed to save grammar analysis.' });
    }
  }

  static async getGrammarHistory(req, res) {
    try {
      const userId = req.user.id;
      const history = await AITutorModel.getGrammarHistory(userId);
      res.json({ success: true, data: history });
    } catch (error) {
      console.error('Error fetching grammar history:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch grammar history.' });
    }
  }

  static async savePronunciationEvaluation(req, res) {
    try {
      const userId = req.user.id;
      const { targetText, spokenText, evaluation, audioUrl } = req.body;

      const evaluationId = await AITutorModel.savePronunciationEvaluation(userId, targetText, spokenText, evaluation, audioUrl);

      res.json({ success: true, evaluationId });
    } catch (error) {
      console.error('Error saving pronunciation evaluation:', error);
      res.status(500).json({ success: false, message: 'Failed to save pronunciation evaluation.' });
    }
  }

  static async getPronunciationHistory(req, res) {
    try {
      const userId = req.user.id;
      const history = await AITutorModel.getPronunciationHistory(userId);
      res.json({ success: true, data: history });
    } catch (error) {
      console.error('Error fetching pronunciation history:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch pronunciation history.' });
    }
  }


  static async getUserProgress(req, res) {
    try {
      const userId = req.user.id;
      let progress = await AITutorModel.getUserProgress(userId);

      if (!progress) {
        const id = await AITutorModel.createInitialProgress(userId);
        progress = await AITutorModel.getUserProgress(userId);
      }

      res.json({ success: true, data: progress });
    } catch (error) {
      console.error('Error fetching user progress:', error);
      res.status(500).json({ success: false, message: 'Failed to fetch progress.' });
    }
  }

  static async updateUserProgress(req, res) {
    try {
      const userId = req.user.id;
      const updates = req.body;

      await AITutorModel.updateProgress(userId, updates);
      const updatedProgress = await AITutorModel.getUserProgress(userId);

      res.json({ success: true, data: updatedProgress });
    } catch (error) {
      console.error('Error updating user progress:', error);
      res.status(500).json({ success: false, message: 'Failed to update progress.' });
    }
  }
}

export default AITutorController;