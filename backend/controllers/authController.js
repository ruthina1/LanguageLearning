// backend/controllers/authController.js
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../models/User.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secretKey';

// Register

export const register = async (req, res) => {
  try {
    const { email, username, password, confirm_password, native_language, target_language } = req.body;

    // Validation...
    if (!email || !username || !password || !confirm_password) {
      return res.status(400).json({ error: 'All input fields are required' });
    }
    if (password !== confirm_password) {
      return res.status(400).json({ error: 'Passwords do not match' });
    }
    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters' });
    }

    // Check if user exists
    const existingUser = await User.findByUsername(username);
    if (existingUser) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Create new user
    const user = await User.create({
      email,
      username,
      password,
      native_language,
      target_language
    });

    // Generate token
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

// Login 
export const login = async (req, res) => {
 
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }

    // Find user by username or email
    const [users] = await pool.query(
      `SELECT id, email, username, password_hash, display_name, avatar_url, 
              native_language, target_language, level, total_xp, current_streak, best_streak 
       FROM users WHERE username = ? OR email = ?`,
      [username, email]
    );

    if (users.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = users[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password_hash);
   
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
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
    res.status(500).json({ error: 'Internal server error: ' + error.message });
  } 
};


export const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ error: "No token provided" });

  const token = authHeader.split(" ")[1];
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ error: "Invalid token" });
    req.userId = decoded.userId;
    next();
  });
};

export const updateLanguagePreferences = async (req, res) => {
  try {
    const { native_language, target_language } = req.body;
    const userId = req.userId; // Assuming you have auth middleware that sets req.userId

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

// Add a method to get user profile with language preferences
export const getProfile = async (req, res) => {
  try {
    const userId = req.userId; // Assuming you have auth middleware that sets req.userId

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