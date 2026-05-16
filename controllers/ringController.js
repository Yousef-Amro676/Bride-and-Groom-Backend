// ─────────────────────────────────────────────
//  controllers/ringController.js
//  Full CRUD for the Ring collection
// ─────────────────────────────────────────────

const Ring = require('../models/Ring');

// ── GET /api/rings
const getAllRings = async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.material) filter.material = req.query.material;
    if (req.query.inStock)  filter.inStock  = req.query.inStock === 'true';

    const rings = await Ring.find(filter).sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: rings.length, data: rings });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/rings/:id
const getRingById = async (req, res, next) => {
  try {
    const ring = await Ring.findById(req.params.id);
    if (!ring) {
      res.status(404);
      throw new Error('Ring not found');
    }
    res.status(200).json({ success: true, data: ring });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/rings
const createRing = async (req, res, next) => {
  try {
    const ring = await Ring.create(req.body);
    res.status(201).json({ success: true, message: 'Ring created', data: ring });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/rings/:id
const updateRing = async (req, res, next) => {
  try {
    const ring = await Ring.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!ring) {
      res.status(404);
      throw new Error('Ring not found');
    }
    res.status(200).json({ success: true, message: 'Ring updated', data: ring });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/rings/:id
const deleteRing = async (req, res, next) => {
  try {
    const ring = await Ring.findByIdAndDelete(req.params.id);
    if (!ring) {
      res.status(404);
      throw new Error('Ring not found');
    }
    res.status(200).json({ success: true, message: 'Ring deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllRings,
  getRingById,
  createRing,
  updateRing,
  deleteRing,
};
