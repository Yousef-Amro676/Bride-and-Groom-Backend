
//  routes/userRoutes.js
//  Auth routes (signup/login) + profile management
//  Uses express-validator for request validation
// ─────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');

const {
  signup,
  login,
  getUserProfile,
  updateUserProfile,
  getAllUsers,
  deleteUser,
} = require('../controllers/userController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate               = require('../middleware/validateMiddleware');

// ── Validation rules for signup ──────────────
const signupRules = [
  body('name')
    .notEmpty().withMessage('Name is required')
    .isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),

  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
];

// ── Validation rules for login ───────────────
const loginRules = [
  body('email')
    .notEmpty().withMessage('Email is required')
    .isEmail().withMessage('Please enter a valid email address'),

  body('password')
    .notEmpty().withMessage('Password is required'),
];

// ─────────────────────────────────────────────
//  Public routes
// ─────────────────────────────────────────────
// POST /api/users/signup
router.post('/signup', signupRules, validate, signup);

// POST /api/users/login
router.post('/login', loginRules, validate, login);

// ─────────────────────────────────────────────
//  Protected routes (require valid JWT)
// ─────────────────────────────────────────────
router.get('/profile/:id',  protect, getUserProfile);
router.put('/profile/:id',  protect, updateUserProfile);

// ─────────────────────────────────────────────
//  Admin-only routes
// ─────────────────────────────────────────────
router.get('/',      protect, adminOnly, getAllUsers);
router.delete('/:id',protect, adminOnly, deleteUser);

module.exports = router;
