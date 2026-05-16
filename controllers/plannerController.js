// ─────────────────────────────────────────────
//  controllers/plannerController.js
//  Full CRUD for the Planner collection
// ─────────────────────────────────────────────

const Planner = require('../models/Planner');

// ── GET /api/planners
const getAllPlanners = async (req, res, next) => {
  try {
    // 1. Basic filter setup
    const filter = {};
    if (req.query.location) {
      filter.location = req.query.location; // Simple exact match
    }

    // 2. Simple sort logic
    let sortObj = { rating: -1 }; // Highest rated first by default
    if (req.query.sort === 'price') sortObj = { pricePackage: 1 };
    if (req.query.sort === '-price') sortObj = { pricePackage: -1 };

    const planners = await Planner.find(filter).sort(sortObj);

    res.status(200).json({ success: true, count: planners.length, data: planners });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/planners/:id
const getPlannerById = async (req, res, next) => {
  try {
    const planner = await Planner.findById(req.params.id);
    if (!planner) {
      res.status(404);
      throw new Error('Planner not found');
    }
    res.status(200).json({ success: true, data: planner });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/planners
const createPlanner = async (req, res, next) => {
  try {
    const planner = await Planner.create(req.body);
    res.status(201).json({ success: true, message: 'Planner added', data: planner });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/planners/:id
const updatePlanner = async (req, res, next) => {
  try {
    const planner = await Planner.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!planner) {
      res.status(404);
      throw new Error('Planner not found');
    }
    res.status(200).json({ success: true, message: 'Planner updated', data: planner });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/planners/:id
const deletePlanner = async (req, res, next) => {
  try {
    const planner = await Planner.findByIdAndDelete(req.params.id);
    if (!planner) {
      res.status(404);
      throw new Error('Planner not found');
    }
    res.status(200).json({ success: true, message: 'Planner deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllPlanners,
  getPlannerById,
  createPlanner,
  updatePlanner,
  deletePlanner,
};
