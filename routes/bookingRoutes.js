// ─────────────────────────────────────────────
//  routes/bookingRoutes.js
//  Booking management — users book services
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();
const { body } = require('express-validator');

const {
  getAllBookings,
  getBookingById,
  getUserBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
} = require('../controllers/bookingController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate = require('../middleware/validateMiddleware');

// ── Validation rules for creating a booking ──
const bookingRules = [
  body('itemId')
    .notEmpty().withMessage('Item ID is required')
    .isMongoId().withMessage('Invalid item ID format'),

  body('itemType')
    .notEmpty().withMessage('Item type is required')
    .isIn([
      'Photographer',
      'Planner',
      'HairStyle',
      'Vendor',
      'Dress',
    ]).withMessage('Invalid Item Type'),

  body('userId')
    .notEmpty().withMessage('User ID is required')
    .isMongoId().withMessage('Invalid user ID format'),

  body('eventDate')
    .notEmpty().withMessage('Event date is required')
    .isISO8601().withMessage('Event date must be a valid date (ISO format)'),
];

// ─────────────────────────────────────────────
//  GET  /api/bookings        → all bookings (admin)
//  POST /api/bookings        → create booking (user)
// ─────────────────────────────────────────────
router.route('/')
  .get(protect, adminOnly, getAllBookings)
  .post(protect, bookingRules, validate, createBooking);

// ─────────────────────────────────────────────
//  GET /api/bookings/my/:userId  → bookings for a user
// ─────────────────────────────────────────────
router.get('/my/:userId', protect, getUserBookings);

// ─────────────────────────────────────────────
//  GET    /api/bookings/:id  → single booking
//  PATCH  /api/bookings/:id  → update status (admin)
//  DELETE /api/bookings/:id  → cancel booking
// ─────────────────────────────────────────────
router.route('/:id')
  .get(protect, getBookingById)
  .patch(protect, adminOnly, updateBookingStatus)
  .delete(protect, deleteBooking);

module.exports = router;
