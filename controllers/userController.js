// ─────────────────────────────────────────────
//  controllers/userController.js
//  Auth (signup/login) + Profile management
//  Uses bcryptjs for password hashing and JWT for tokens
//  Hardened with detailed logging for Vercel debugging
// ─────────────────────────────────────────────

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: generate a signed JWT token ──────
const generateToken = (userId) => {
  const secret = process.env.JWT_SECRET;

  if (!secret) {
    console.error('🔴 FATAL: JWT_SECRET is not defined in environment variables');
    throw new Error('Server configuration error — JWT_SECRET is missing');
  }

  try {
    const token = jwt.sign(
      { id: userId },
      secret,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
    console.log('✅ JWT generated successfully for user:', userId);
    return token;
  } catch (err) {
    console.error('🔴 JWT generation failed:', err.message);
    throw new Error('Failed to generate authentication token');
  }
};

// ─────────────────────────────────────────────
// @desc    Register (Signup) a new user
// @route   POST /api/users/signup
// @access  Public
// ─────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    console.log('📝 Signup attempt for email:', req.body?.email);

    const { name, email, password, phone } = req.body || {};

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and password are required',
      });
    }

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Password is hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, password, phone });
    console.log('✅ User created successfully:', user._id);

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token,
      },
    });
  } catch (error) {
    console.error('🔴 Signup error:', error.message);
    console.error('🔴 Signup stack:', error.stack);

    // Handle Mongoose duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists',
      });
    }

    // Handle Mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message).join(', ');
      return res.status(400).json({
        success: false,
        message: messages,
      });
    }

    // Fallback: always return JSON, never crash
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'An error occurred during signup',
      });
    }
  }
};

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// ─────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    console.log('🔐 Login attempt — raw body type:', typeof req.body);
    console.log('🔐 Login attempt — body keys:', req.body ? Object.keys(req.body) : 'null/undefined');

    // Guard against missing or unparsed body
    if (!req.body || typeof req.body !== 'object') {
      console.error('🔴 req.body is missing or not an object:', req.body);
      return res.status(400).json({
        success: false,
        message: 'Request body is missing — ensure Content-Type is application/json',
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      console.warn('⚠️  Login missing fields — email:', !!email, 'password:', !!password);
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    // ── Step 1: MongoDB query ──────────────────
    console.log('🔍 Querying MongoDB for user:', email);
    let user;
    try {
      user = await User.findOne({ email }).select('+password');
    } catch (dbError) {
      console.error('🔴 MongoDB query failed:', dbError.message);
      console.error('🔴 MongoDB query stack:', dbError.stack);
      return res.status(500).json({
        success: false,
        message: 'Database query failed — please try again',
      });
    }

    if (!user) {
      console.warn('⚠️  No user found for email:', email);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    console.log('✅ User found:', user._id);

    // ── Step 2: bcrypt compare ─────────────────
    console.log('🔑 Comparing passwords with bcryptjs...');
    let isMatch;
    try {
      isMatch = await user.matchPassword(password);
    } catch (bcryptError) {
      console.error('🔴 bcrypt.compare failed:', bcryptError.message);
      console.error('🔴 bcrypt.compare stack:', bcryptError.stack);
      return res.status(500).json({
        success: false,
        message: 'Password verification failed — please try again',
      });
    }

    if (!isMatch) {
      console.warn('⚠️  Password mismatch for user:', user._id);
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }
    console.log('✅ Password matches');

    // ── Step 3: JWT generation ─────────────────
    console.log('🎟️  Generating JWT token...');
    let token;
    try {
      token = generateToken(user._id);
    } catch (jwtError) {
      console.error('🔴 Token generation failed:', jwtError.message);
      return res.status(500).json({
        success: false,
        message: 'Failed to generate authentication token',
      });
    }

    console.log('✅ Login successful for user:', user._id);
    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token,
      },
    });
  } catch (error) {
    // Catch-all: log and return JSON — NEVER crash the serverless function
    console.error('🔴 Login unhandled error:', error.message);
    console.error('🔴 Login error stack:', error.stack);
    console.error('🔴 Login error name:', error.name);

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'An internal error occurred during login',
      });
    }
  }
};

// ─────────────────────────────────────────────
// @desc    Get logged-in user's profile
// @route   GET /api/users/profile/:id
// @access  Protected
// ─────────────────────────────────────────────
const getUserProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('🔴 getUserProfile error:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve user profile',
      });
    }
  }
};

// ─────────────────────────────────────────────
// @desc    Update user profile
// @route   PUT /api/users/profile/:id
// @access  Protected
// ─────────────────────────────────────────────
const updateUserProfile = async (req, res, next) => {
  try {
    // Prevent direct password update via this route (use a dedicated change-password endpoint)
    delete req.body.password;
    delete req.body.role; // Prevent role escalation

    const user = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    console.error('🔴 updateUserProfile error:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to update user profile',
      });
    }
  }
};

// ─────────────────────────────────────────────
// @desc    Get all users
// @route   GET /api/users
// @access  Admin
// ─────────────────────────────────────────────
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find({}).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: users.length, data: users });
  } catch (error) {
    console.error('🔴 getAllUsers error:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to retrieve users',
      });
    }
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a user
// @route   DELETE /api/users/:id
// @access  Admin
// ─────────────────────────────────────────────
const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('🔴 deleteUser error:', error.message);
    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message: 'Failed to delete user',
      });
    }
  }
};

module.exports = {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
};
