// ─────────────────────────────────────────────
//  routes/ringRoutes.js
//  CRUD endpoints for wedding rings
// ─────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const {
  getAllRings,
  getRingById,
  createRing,
  updateRing,
  deleteRing,
} = require('../controllers/ringController');

router.route('/')
  .get(getAllRings)
  .post(createRing);

router.route('/:id')
  .get(getRingById)
  .put(updateRing)
  .delete(deleteRing);

module.exports = router;
