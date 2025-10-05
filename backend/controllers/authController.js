
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import pool from '../config/db.js';  

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';


export const register = async (req, res) => {
  try {
    const { email, username, password, confirm_password, native_language, target_language } = req.body;

    if (!email || !username || !password || !confirm_password) {
      return res.status(400).json({ error: 'All input fields are required' });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    const user = await User.create({
      email,
      username,
      password,
      native_language,
      target_language
    });


    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET || 'secretKey',
      { expiresIn: '24h' }
    );

    res.status(201).json({
      message: 'User created successfully',
      user,
      token
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ 
        success: false,  
        error: 'Username and password are required' 
      });
    }


    const [rows] = await pool.query(
      `SELECT id, email, username, password_hash, display_name, avatar_url, 
              native_language, target_language, level, total_xp, current_streak, best_streak
       FROM users
       WHERE username = ? OR email = ?`,
      [username, username]
    );

    if (rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }

    const user = rows[0];


    const isValidPassword = await bcrypt.compare(password, user.password_hash);

    if (!isValidPassword) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid credentials' 
      });
    }


    const token = jwt.sign(
      { userId: user.id, username: user.username },
      process.env.JWT_SECRET, 
      { expiresIn: '24h' }
    );

    res.json({
      success: true,  
      message: 'Login successful',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar: user.avatar_url,
        native_language: user.native_language,
        target_language: user.target_language,
        level: user.level,
        xp: user.total_xp,
        streak: user.current_streak,
        best_streak: user.best_streak
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false,  
      error: 'Internal server error: ' + error.message 
    });
  }
};

export const verifyToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  if (!authHeader) return res.status(401).json({ message: "No token provided" });

  const token = authHeader.split(" ")[1]; 
  if (!token) return res.status(401).json({ message: "Malformed token" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    console.error("Verify token error:", err);
    res.status(403).json({ message: "Invalid token" });
  }
};


export const verifyTokenController = async (req, res) => {
  try {
    const userId = req.user.userId; 


    const [rows] = await pool.query(
      `SELECT id, email, username, display_name, avatar_url, 
              native_language, target_language, level, total_xp, 
              current_streak, best_streak
       FROM users WHERE id = ?`,
      [userId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const user = rows[0];

    res.json({
      success: true,
      message: 'Token is valid',
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar: user.avatar_url,
        native_language: user.native_language,
        target_language: user.target_language,
        level: user.level,
        xp: user.total_xp,
        streak: user.current_streak,
        best_streak: user.best_streak,
      },
    });
  } catch (error) {
    console.error('Verify token error:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
};


export const updateLanguagePreferences = async (req, res) => {
  try {
    const { native_language, target_language } = req.body;
    const userId = req.userId; 

    if (!native_language || !target_language) {
      return res.status(400).json({ error: 'Both language preferences are required' });
    }

    const success = await User.updateLanguages(userId, native_language, target_language);
    
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      message: 'Language preferences updated successfully',
      native_language,
      target_language
    });

  } catch (error) {
    console.error('Update language preferences error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};


export const getProfile = async (req, res) => {
  try {
    const userId = req.userId; 

    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        display_name: user.display_name,
        avatar: user.avatar_url,
        native_language: user.native_language,
        target_language: user.target_language,
        level: user.level,
        xp: user.total_xp,
        streak: user.current_streak,
        best_streak: user.best_streak,
        created_at: user.created_at
      }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};