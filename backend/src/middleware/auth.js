const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const redisClient = require('../config/redis');

// Verify JWT token
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Check if token is blacklisted
    const isBlacklisted = await redisClient.get(`blacklist:${token}`);
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token has been revoked' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Get user from database
    const userResult = await pool.query(
      'SELECT id, email, name, role, email_verified FROM users WHERE id = $1',
      [decoded.userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    req.user = userResult.rows[0];
    next();
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }
    
    console.error('Auth middleware error:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Authentication error' 
    });
  }
};

// Check if user is official
const requireOfficial = (req, res, next) => {
  if (req.user.role !== 'official') {
    return res.status(403).json({ 
      success: false, 
      message: 'Official access required' 
    });
  }
  next();
};

// Optional authentication (for guest reports)
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const userResult = await pool.query(
        'SELECT id, email, name, role, email_verified FROM users WHERE id = $1',
        [decoded.userId]
      );
      
      if (userResult.rows.length > 0) {
        req.user = userResult.rows[0];
      }
    }
    
    next();
  } catch (error) {
    // Continue without authentication for optional auth
    next();
  }
};

// Rate limiting middleware
const rateLimit = require('express-rate-limit');

const createRateLimit = (windowMs, max, message) => {
  return rateLimit({
    windowMs,
    max,
    message: { success: false, message },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// Different rate limits for different endpoints
const authRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  5, // 5 attempts
  'Too many authentication attempts, please try again later'
);

const reportRateLimit = createRateLimit(
  60 * 1000, // 1 minute
  10, // 10 reports per minute
  'Too many reports submitted, please slow down'
);

const generalRateLimit = createRateLimit(
  15 * 60 * 1000, // 15 minutes
  100, // 100 requests per 15 minutes
  'Too many requests, please try again later'
);

module.exports = {
  authenticateToken,
  requireOfficial,
  optionalAuth,
  authRateLimit,
  reportRateLimit,
  generalRateLimit
};
