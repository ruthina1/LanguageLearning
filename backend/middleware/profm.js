import jwt from 'jsonwebtoken';
import pool from '../config/db.js';

export const protect = async (req, res, next) => {
  try {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-fallback-secret');
      console.log('Decoded token:', decoded);

      const userId = decoded.id || decoded.userId;
      
      if (!userId) {
        return res.status(401).json({
          success: false,
          message: 'Invalid token payload'
        });
      }

      const [users] = await pool.query(
        'SELECT id, email, username, display_name, avatar_url, native_language, target_language, level FROM users WHERE id = ?',
        [userId]
      );

      if (users.length === 0) {
        console.log(`User with ID ${userId} not found in database`);
        return res.status(401).json({
          success: false,
          message: 'User not found'
        });
      }

      req.user = users[0];
      next();
    } catch (error) {
      console.error('Token verification error:', error);
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error in authentication'
    });
  }
};

export const admin = (req, res, next) => {
  next();
};

export default {
  protect,
  admin
};