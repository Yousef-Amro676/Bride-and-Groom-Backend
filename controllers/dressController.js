// ─────────────────────────────────────────────
//  controllers/dressController.js
//  Full CRUD for the Dress collection
// ─────────────────────────────────────────────

const Dress = require('../models/Dress');

// ── @desc    Get all dresses (with optional filtering)
// ── @route   GET /api/dresses
// ── @route   GET /api/dresses?category=bridal
// ── @access  Public
const getAllDresses = async (req, res, next) => {
  try {
    // 1. Get query parameters
    const category = req.query.category;
    const sortParams = req.query.sort;

    // 2. Build a simple filter
    const filter = {};
    if (category) filter.category = category;

    // 3. Simple sorting logic
    let sortObj = { createdAt: -1 }; // Default: newest first
    if (sortParams === 'price') sortObj = { price: 1 };
    if (sortParams === '-price') sortObj = { price: -1 };

    // 4. Get the dresses from the database
    const dresses = await Dress.find(filter).sort(sortObj);

    res.status(200).json({
      success: true,
      count: dresses.length,
      data: dresses,
    });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Get single dress by ID
// ── @route   GET /api/dresses/:id
// ── @access  Public
const getDressById = async (req, res, next) => {
  try {
    const dress = await Dress.findById(req.params.id);

    if (!dress) {
      res.status(404);
      throw new Error('Dress not found');
    }

    res.status(200).json({ success: true, data: dress });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Create a new dress
// ── @route   POST /api/dresses
// ── @access  Admin
const createDress = async (req, res, next) => {
  try {
    const dress = await Dress.create(req.body);
    res.status(201).json({ success: true, message: 'Dress created', data: dress });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Update a dress
// ── @route   PUT /api/dresses/:id
// ── @access  Admin
const updateDress = async (req, res, next) => {
  try {
    const dress = await Dress.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!dress) {
      res.status(404);
      throw new Error('Dress not found');
    }

    res.status(200).json({ success: true, message: 'Dress updated', data: dress });
  } catch (error) {
    next(error);
  }
};

// ── @desc    Delete a dress
// ── @route   DELETE /api/dresses/:id
// ── @access  Admin
const deleteDress = async (req, res, next) => {
  try {
    const dress = await Dress.findByIdAndDelete(req.params.id);

    if (!dress) {
      res.status(404);
      throw new Error('Dress not found');
    }

    res.status(200).json({ success: true, message: 'Dress deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllDresses,
  getDressById,
  createDress,
  updateDress,
  deleteDress,
};
