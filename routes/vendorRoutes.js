// ─────────────────────────────────────────────
//  routes/vendorRoutes.js
//  Full CRUD + filtering for vendors
//  Supports: ?category= ?location= ?minPrice= ?maxPrice= ?search= ?sort=
// ─────────────────────────────────────────────

const express  = require('express');
const router   = express.Router();
const { body } = require('express-validator');

const {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
} = require('../controllers/vendorController');

const { protect, adminOnly } = require('../middleware/authMiddleware');
const validate               = require('../middleware/validateMiddleware');

// ── Validation rules for creating a vendor ──
const vendorRules = [
  body('vendorName')
    .notEmpty().withMessage('Vendor name is required'),

  body('category')
    .notEmpty().withMessage('Category is required')
    .isIn([
      'photographer','planner','dress','ring',
      'florist','catering','hair & makeup','videographer','venue','other',
    ]).withMessage('Invalid category'),

  body('location')
    .notEmpty().withMessage('Location is required'),

  body('price')
    .notEmpty().withMessage('Price is required')
    .isNumeric().withMessage('Price must be a number')
    .custom((v) => v >= 0).withMessage('Price cannot be negative'),
];

// ─────────────────────────────────────────────
//  GET  /api/vendors         → list (public, filterable)
//  POST /api/vendors         → create (admin only)
// ─────────────────────────────────────────────
router.route('/')
  .get(getAllVendors)
  .post(protect, adminOnly, vendorRules, validate, createVendor);

// ─────────────────────────────────────────────
//  GET    /api/vendors/:id   → single vendor (public)
//  PATCH  /api/vendors/:id   → update vendor (admin)
//  DELETE /api/vendors/:id   → delete vendor (admin)
// ─────────────────────────────────────────────
router.route('/:id')
  .get(getVendorById)
  .patch(protect, adminOnly, updateVendor)
  .delete(protect, adminOnly, deleteVendor);

module.exports = router;
