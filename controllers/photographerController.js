// ─────────────────────────────────────────────
//  controllers/photographerController.js
//  Full CRUD for the Photographer collection
// ─────────────────────────────────────────────

const Photographer = require('../models/Photographer');

// ── GET /api/photographers
const getAllPhotographers = async (req, res, next) => {
  try {
    // 1. Setup a basic filter
    const filter = {};
    if (req.query.location) {
      filter.location = req.query.location; // Simple exact match instead of Regex
    }

    // 2. Simple sorting
    let sortObj = { rating: -1 }; // Highest rated first by default
    if (req.query.sort === 'price') sortObj = { pricePerDay: 1 };
    if (req.query.sort === '-price') sortObj = { pricePerDay: -1 };

    const photographers = await Photographer.find(filter).sort(sortObj);

    res.status(200).json({ success: true, count: photographers.length, data: photographers });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/photographers/:id
const getPhotographerById = async (req, res, next) => {
  try {
    const photographer = await Photographer.findById(req.params.id);
    if (!photographer) {
      res.status(404);
      throw new Error('Photographer not found');
    }
    res.status(200).json({ success: true, data: photographer });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/photographers
const createPhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.create(req.body);
    res.status(201).json({ success: true, message: 'Photographer added', data: photographer });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/photographers/:id
const updatePhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!photographer) {
      res.status(404);
      throw new Error('Photographer not found');
    }
    res.status(200).json({ success: true, message: 'Photographer updated', data: photographer });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/photographers/:id
const deletePhotographer = async (req, res, next) => {
  try {
    const photographer = await Photographer.findByIdAndDelete(req.params.id);
    if (!photographer) {
      res.status(404);
      throw new Error('Photographer not found');
    }
    res.status(200).json({ success: true, message: 'Photographer deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPhotographers,
  getPhotographerById,
  createPhotographer,
  updatePhotographer,
  deletePhotographer,
};
