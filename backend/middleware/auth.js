// ============================================
// JWT Authentication Middleware
// ============================================

const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Protect routes - Verifies JWT token from Authorization header.
 * Attaches the authenticated user to req.user.
 */
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token in Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  // If no token found
  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. No token provided.'
    });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to request (without password)
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized. User not found.'
      });
    }

    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Token is invalid or expired.'
    });
  }
};

module.exports = { protect };
