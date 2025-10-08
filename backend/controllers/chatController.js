import pool from '../config/db.js';
import { findBestResponse } from '../models/Chat.js';

export const sendMessage = async (req, res) => {
  try {
    const userMessage = req.body.message;


    if (userMessage === 'Your message here' || !userMessage || userMessage.trim() === '') {
      return res.json({ 
        reply: "Please type a real message! I'm here to help with language learning questions." 
      });
    }

    const botReply = findBestResponse(userMessage);
    console.log('Bot response:', botReply.substring(0, 100));
    console.log('===================');


    pool.query(
      'INSERT INTO chats (user_message, bot_response) VALUES (?, ?)',
      [userMessage, botReply],
      (err, results) => {
        if (err) {
          console.error('Error saving chat to database:', err);
        }
      }
    );

    res.json({ reply: botReply });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    res.json({ 
      reply: "I'm here to help with language learning! You can ask me about vocabulary, grammar, or pronunciation." 
    });
  }
};