// ─────────────────────────────────────────────
//  controllers/hairStyleController.js
//  Full CRUD for HairStyle
// ─────────────────────────────────────────────

const HairStyle = require('../models/HairStyle');

// ── GET /api/hairstyles
const getAllHairStyles = async (req, res, next) => {
  try {
    // 1. Basic filter setup
    const filter = {};
    if (req.query.location) {
      filter.salon = req.query.location; // Simple exact match for salon location
    }
    
    // 2. Simple sort logic
    let sortObj = { rating: -1 }; // Highest rated first by default
    if (req.query.sort === 'price') sortObj = { price: 1 };
    if (req.query.sort === '-price') sortObj = { price: -1 };

    const hairStyles = await HairStyle.find(filter).sort(sortObj);

    res.status(200).json({ success: true, count: hairStyles.length, data: hairStyles });
  } catch (error) {
    next(error);
  }
};

// ── GET /api/hairstyles/:id
const getHairStyleById = async (req, res, next) => {
  try {
    const hairStyle = await HairStyle.findById(req.params.id);
    if (!hairStyle) {
      res.status(404);
      throw new Error('HairStyle not found');
    }
    res.status(200).json({ success: true, data: hairStyle });
  } catch (error) {
    next(error);
  }
};

// ── POST /api/hairstyles
const createHairStyle = async (req, res, next) => {
  try {
    const hairStyle = await HairStyle.create(req.body);
    res.status(201).json({ success: true, message: 'HairStyle added', data: hairStyle });
  } catch (error) {
    next(error);
  }
};

// ── PUT /api/hairstyles/:id
const updateHairStyle = async (req, res, next) => {
  try {
    const hairStyle = await HairStyle.findByIdAndUpdate(
      req.params.id, req.body, { new: true, runValidators: true }
    );
    if (!hairStyle) {
      res.status(404);
      throw new Error('HairStyle not found');
    }
    res.status(200).json({ success: true, message: 'HairStyle updated', data: hairStyle });
  } catch (error) {
    next(error);
  }
};

// ── DELETE /api/hairstyles/:id
const deleteHairStyle = async (req, res, next) => {
  try {
    const hairStyle = await HairStyle.findByIdAndDelete(req.params.id);
    if (!hairStyle) {
      res.status(404);
      throw new Error('HairStyle not found');
    }
    res.status(200).json({ success: true, message: 'HairStyle deleted' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllHairStyles,
  getHairStyleById,
  createHairStyle,
  updateHairStyle,
  deleteHairStyle,
};
