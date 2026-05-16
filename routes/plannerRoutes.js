// ─────────────────────────────────────────────
//  routes/plannerRoutes.js
//  CRUD endpoints for wedding planners
// ─────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const {
  getAllPlanners,
  getPlannerById,
  createPlanner,
  updatePlanner,
  deletePlanner,
} = require('../controllers/plannerController');

router.route('/')
  .get(getAllPlanners)
  .post(createPlanner);

router.route('/:id')
  .get(getPlannerById)
  .put(updatePlanner)
  .delete(deletePlanner);

module.exports = router;
