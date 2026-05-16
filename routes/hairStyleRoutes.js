// ─────────────────────────────────────────────
//  routes/hairStyleRoutes.js
//  Routes for HairStyle
// ─────────────────────────────────────────────

const express = require('express');
const router = express.Router();

const {
  getAllHairStyles,
  getHairStyleById,
  createHairStyle,
  updateHairStyle,
  deleteHairStyle,
} = require('../controllers/hairStyleController');

const { protect, adminOnly } = require('../middleware/authMiddleware');

router.route('/')
  .get(getAllHairStyles)
  .post(protect, adminOnly, createHairStyle);

router.route('/:id')
  .get(getHairStyleById)
  .put(protect, adminOnly, updateHairStyle)
  .delete(protect, adminOnly, deleteHairStyle);

module.exports = router;
