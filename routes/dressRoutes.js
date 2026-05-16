// ─────────────────────────────────────────────
//  routes/dressRoutes.js
//  CRUD endpoints for dresses
// ─────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const {
  getAllDresses,
  getDressById,
  createDress,
  updateDress,
  deleteDress,
} = require('../controllers/dressController');

// GET  /api/dresses        → list all dresses
// POST /api/dresses        → create a new dress (admin)
router.route('/')
  .get(getAllDresses)
  .post(createDress);

// GET    /api/dresses/:id  → get single dress
// PUT    /api/dresses/:id  → update dress (admin)
// DELETE /api/dresses/:id  → delete dress (admin)
router.route('/:id')
  .get(getDressById)
  .put(updateDress)
  .delete(deleteDress);

module.exports = router;
