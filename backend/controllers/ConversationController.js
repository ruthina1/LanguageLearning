import ConversationModel from '../models/ConversationModel.js';
import MessageModel from '../models/MessageModel.js';
import AIProgressModel from '../models/AIProgressModel.js';
import AIService from '../services/aiService.js';

class conversationController  {
  async getConversations(req, res) {
    try {
      const conversations = await ConversationModel.getUserConversations(req.user.id);
      res.json(conversations);
    } catch (error) {
      console.error('Get conversations error:', error);
      res.status(500).json({ error: 'Failed to fetch conversations' });
    }
  }

  async getConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const conversation = await ConversationModel.getConversationWithMessages(conversationId, req.user.id);
      
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      res.json(conversation);
    } catch (error) {
      console.error('Get conversation error:', error);
      res.status(500).json({ error: 'Failed to fetch conversation' });
    }
  }

  async sendMessage(req, res) {
    try {
      const { message, conversationId = null } = req.body;
      
      let currentConversationId = conversationId;
      
      // Create new conversation if no conversationId provided
      if (!currentConversationId) {
        currentConversationId = await ConversationModel.createConversation(req.user.id, message.substring(0, 50) + '...');
      }
      
      // Save user message
      const userMessage = await MessageModel.createMessage(currentConversationId, message, 'user');
      
      // Get conversation history for context
      const conversationHistory = await MessageModel.getConversationMessages(currentConversationId);
      
      // Generate AI response
      const aiResponse = await AIService.generateChatResponse(message, conversationHistory);
      
      // Save AI response
      const assistantMessage = await MessageModel.createMessage(
        currentConversationId,
        aiResponse.response,
        'assistant',
        aiResponse.amharicTranslation,
        aiResponse.pronunciationTips,
        aiResponse.grammarCorrections
      );
      
      // Update AI progress
      await AIProgressModel.incrementAISessionCount(req.user.id, 'chat');
      await AIProgressModel.addAIXP(req.user.id, 5);
      
      res.json({
        conversationId: currentConversationId,
        userMessage,
        assistantMessage
      });
      
    } catch (error) {
      console.error('Send message error:', error);
      res.status(500).json({ error: 'Failed to send message' });
    }
  }

  async deleteConversation(req, res) {
    try {
      const { conversationId } = req.params;
      const success = await ConversationModel.deleteConversation(conversationId, req.user.id);
      
      if (!success) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      res.json({ message: 'Conversation deleted successfully' });
    } catch (error) {
      console.error('Delete conversation error:', error);
      res.status(500).json({ error: 'Failed to delete conversation' });
    }
  }

  async clearConversation(req, res) {
    try {
      const { conversationId } = req.params;
      
      // Verify conversation belongs to user
      const conversation = await ConversationModel.getConversationWithMessages(conversationId, req.user.id);
      if (!conversation) {
        return res.status(404).json({ error: 'Conversation not found' });
      }
      
      // Delete all messages in conversation
      await MessageModel.deleteConversationMessages(conversationId);
      
      res.json({ message: 'Conversation cleared successfully' });
    } catch (error) {
      console.error('Clear conversation error:', error);
      res.status(500).json({ error: 'Failed to clear conversation' });
    }
  }
}

export default new conversationController ();
