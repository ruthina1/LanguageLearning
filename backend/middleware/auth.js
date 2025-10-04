import jwt from 'jsonwebtoken';

const auth = (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'No token, authorization denied' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

  
    req.user = {
      id: decoded.id || decoded.userId,   
      name: decoded.name || decoded.username || 'User'
    };

    if (!req.user.id) {
      return res.status(401).json({ success: false, error: 'Invalid token structure' });
    }

    next();
  } catch (error) {
    console.error('Auth Middleware Error:', error.message);
    res.status(401).json({ success: false, error: 'Token is not valid' });
  }
};

export default auth;
