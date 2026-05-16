// ─────────────────────────────────────────────
//  routes/photographerRoutes.js
//  CRUD endpoints for photographers
// ─────────────────────────────────────────────

const express = require('express');
const router  = express.Router();
const {
  getAllPhotographers,
  getPhotographerById,
  createPhotographer,
  updatePhotographer,
  deletePhotographer,
} = require('../controllers/photographerController');

router.route('/')
  .get(getAllPhotographers)
  .post(createPhotographer);

router.route('/:id')
  .get(getPhotographerById)
  .put(updatePhotographer)
  .delete(deletePhotographer);

module.exports = router;
