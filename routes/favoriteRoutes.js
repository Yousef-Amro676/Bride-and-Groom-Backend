// ─────────────────────────────────────────────
//  routes/favoriteRoutes.js
//  Routes for favorites
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getUserFavorites,
  addFavorite,
  removeFavorite,
} = require('../controllers/favoriteController');

const { protect } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

const favoriteRules = [
  body('userId').notEmpty().withMessage('User ID is required').isMongoId().withMessage('Invalid User ID'),
  body('itemId').notEmpty().withMessage('Item ID is required').isMongoId().withMessage('Invalid Item ID'),
  body('itemType').notEmpty().withMessage('Item type is required')
    .isIn(['Dress', 'Photographer', 'Planner', 'HairStyle', 'Ring', 'Vendor']).withMessage('Invalid Item Type'),
];

router.route('/')
  .post(protect, favoriteRules, validate, addFavorite);

router.get('/my/:userId', protect, getUserFavorites);

router.route('/:id')
  .delete(protect, removeFavorite);

module.exports = router;
