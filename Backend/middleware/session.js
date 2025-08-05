const session = require('cookie-session');
const cookieParser = require('cookie-parser');

// Session configuration
const sessionConfig = {
  name: 'intervue-session',
  keys: [process.env.SESSION_SECRET || 'your-session-secret-key'],
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax'
};

// Initialize session middleware
const initializeSession = (app) => {
  app.use(cookieParser());
  app.use(session(sessionConfig));
};

// Session helper functions
const setUserSession = (req, user) => {
  req.session.userId = user._id;
  req.session.userType = user.userType;
  req.session.email = user.email;
  req.session.isAuthenticated = true;
  req.session.lastActivity = Date.now();
};

const clearUserSession = (req) => {
  req.session = null;
};

const isSessionValid = (req) => {
  if (!req.session || !req.session.isAuthenticated) {
    return false;
  }
  
  // Check if session has expired (30 minutes of inactivity)
  const thirtyMinutes = 30 * 60 * 1000;
  if (Date.now() - req.session.lastActivity > thirtyMinutes) {
    clearUserSession(req);
    return false;
  }
  
  // Update last activity
  req.session.lastActivity = Date.now();
  return true;
};

const requireAuth = (req, res, next) => {
  if (!isSessionValid(req)) {
    return res.status(401).json({ error: 'Authentication required' });
  }
  next();
};

const requireUserType = (userType) => {
  return (req, res, next) => {
    if (!isSessionValid(req)) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    if (req.session.userType !== userType) {
      return res.status(403).json({ error: 'Access denied' });
    }
    
    next();
  };
};

module.exports = {
  initializeSession,
  setUserSession,
  clearUserSession,
  isSessionValid,
  requireAuth,
  requireUserType
}; 