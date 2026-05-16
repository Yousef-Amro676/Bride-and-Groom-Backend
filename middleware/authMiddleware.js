// ─────────────────────────────────────────────
//  middleware/authMiddleware.js
//  Verifies JWT token on protected routes.
//  Usage: add protect as middleware on any route
//  that requires a logged-in user.
// ─────────────────────────────────────────────

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── protect ──────────────────────────────────
//  Checks Authorization header for a valid Bearer token.
//  Attaches the decoded user object to req.user.
const protect = async (req, res, next) => {
  try {
    let token;

    // Token is sent as: Authorization: Bearer <token>
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      res.status(401);
      throw new Error('Not authorized — no token provided');
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user to the request (excluding password)
    req.user = await User.findById(decoded.id).select('-password');

    if (!req.user) {
      res.status(401);
      throw new Error('Not authorized — user no longer exists');
    }

    next();
  } catch (error) {
    next(error);
  }
};

// ── adminOnly ─────────────────────────────────
//  Must be used AFTER protect middleware.
//  Ensures the logged-in user has the 'admin' role.
const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403);
    next(new Error('Access denied — admin only'));
  }
};

module.exports = { protect, adminOnly };
