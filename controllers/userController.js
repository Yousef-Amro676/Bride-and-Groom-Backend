// ─────────────────────────────────────────────
//  controllers/userController.js
//  Auth (signup/login) + Profile management
//  Uses bcrypt for password hashing and JWT for tokens
// ─────────────────────────────────────────────

const jwt  = require('jsonwebtoken');
const User = require('../models/User');

// ── Helper: generate a signed JWT token ──────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
  );
};

// ─────────────────────────────────────────────
// @desc    Register (Signup) a new user
// @route   POST /api/users/signup
// @access  Public
// ─────────────────────────────────────────────
const signup = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    // Check for duplicate email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      res.status(400);
      throw new Error('An account with this email already exists');
    }

    // Password is hashed automatically by the pre-save hook in User.js
    const user = await User.create({ name, email, password, phone });

    res.status(201).json({
      success: true,
      message: 'Account created successfully',
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id), // Return token so user is instantly logged in
      },
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Login user
// @route   POST /api/users/login
// @access  Public
// ─────────────────────────────────────────────
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Please provide both email and password');
    }

    // Explicitly fetch password (hidden by default via select: false in schema)
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    // Use bcrypt compare via the model instance method
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Invalid email or password');
    }

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        _id:   user._id,
        name:  user.name,
        email: user.email,
        role:  user.role,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    next(error);
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
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ success: true, data: user });
  } catch (error) {
    next(error);
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
      res.status(404);
      throw new Error('User not found');
    }

    res.status(200).json({ success: true, message: 'Profile updated', data: user });
  } catch (error) {
    next(error);
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
    next(error);
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
      res.status(404);
      throw new Error('User not found');
    }
    res.status(200).json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    next(error);
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
