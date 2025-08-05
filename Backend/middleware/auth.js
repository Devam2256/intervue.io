const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User'); // Changed from '../models/userModel' to '../models/User'

// Rate limiting middleware
const createRateLimiter = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { error: message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Auth rate limiters
const authLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  5, // 5 requests per window
  'Too many authentication attempts. Please try again later.'
);

const otpLimiter = createRateLimiter(
  5 * 60 * 1000, // 5 minutes
  10, // Increased from 3 to 10 requests per window
  'Too many OTP requests. Please try again later.'
);

// JWT token verification middleware
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId).select('-password');
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid token' });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ error: 'Invalid token' });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ error: 'Token expired' });
    }
    return res.status(500).json({ error: 'Token verification failed' });
  }
};

// Optional authentication middleware (doesn't fail if no token)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId).select('-password');
      if (user) {
        req.user = user;
      }
    }
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
};

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

module.exports = {
  authenticateToken,
  optionalAuth,
  generateToken,
  authLimiter,
  otpLimiter
};