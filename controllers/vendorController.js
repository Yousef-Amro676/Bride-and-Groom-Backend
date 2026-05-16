// ─────────────────────────────────────────────
//  controllers/vendorController.js
//  Full CRUD + advanced filtering/search/sorting
//  Includes Flutter-compatible field remapping
// ─────────────────────────────────────────────

const Vendor = require('../models/Vendor');

// ─────────────────────────────────────────────
//  Flutter Compatibility Layer
//  The Flutter app was built for Firebase Firestore which
//  used different field names. This mapping lets the Flutter
//  UI code stay unchanged while we serve data from MongoDB.
// ─────────────────────────────────────────────

// Map old Firebase category names → MongoDB enum values
const categoryAliases = {
  'dresses':          'dress',
  'photographers':    'photographer',
  'wedding_planners': 'planner',
  'hair_makeup':      'hair & makeup',
};

// Transform a MongoDB vendor document into the format Flutter expects
function toFlutterFormat(vendor) {
  const obj = vendor.toObject ? vendor.toObject() : vendor;
  return {
    id:          obj._id.toString(),   // Firestore used doc.id
    name:        obj.vendorName,       // Firestore field was 'name'
    imageUrl:    obj.image || '',      // Firestore field was 'imageUrl'
    location:    obj.location,
    price:       obj.price,
    category:    obj.category,
    description: obj.description || '',
    phone:       obj.phone || '',
    email:       obj.email || '',
    rating:      obj.rating || 0,
    available:   obj.available,
  };
}

// ─────────────────────────────────────────────
// @desc    Get all vendors with filtering, search & sort
// @route   GET /api/vendors
// @route   GET /api/vendors?category=photographer
// @route   GET /api/vendors?category=dresses  (Flutter alias)
// @route   GET /api/vendors?location=cairo
// @route   GET /api/vendors?sort=price (or -price for desc)
// @access  Public
// ─────────────────────────────────────────────
const getAllVendors = async (req, res, next) => {
  try {
    // 1. Get query parameters
    let category = req.query.category;
    const location = req.query.location;
    const sortParams = req.query.sort;

    // 2. Build a simple filter object
    const filter = {};

    if (category) {
      // Convert Flutter's old Firebase category names to MongoDB enum values
      category = category.toLowerCase();
      filter.category = categoryAliases[category] || category;
    }

    if (location) {
      // Use a basic regex to allow partial matches (e.g. searching "cairo" matches "Cairo City")
      filter.location = { $regex: location, $options: 'i' };
    }

    // 3. Simple sorting logic
    let sortObj = { createdAt: -1 }; // Newest first by default
    if (sortParams === 'price') sortObj = { price: 1 };
    if (sortParams === '-price') sortObj = { price: -1 };
    if (sortParams === '-rating') sortObj = { rating: -1 };

    // 4. Fetch vendors from database
    const vendors = await Vendor.find(filter).sort(sortObj);

    // 5. Remap fields to match what Flutter expects
    const data = vendors.map(toFlutterFormat);

    res.status(200).json({
      success: true,
      count: data.length,
      data: data,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get single vendor by ID
// @route   GET /api/vendors/:id
// @access  Public
// ─────────────────────────────────────────────
const getVendorById = async (req, res, next) => {
  try {
    const vendor = await Vendor.findById(req.params.id);

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    // Remap fields to match what Flutter expects
    res.status(200).json({ success: true, data: toFlutterFormat(vendor) });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Create a new vendor
// @route   POST /api/vendors
// @access  Admin
// ─────────────────────────────────────────────
const createVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.create(req.body);
    res.status(201).json({ success: true, message: 'Vendor created', data: vendor });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Update a vendor (partial update with PATCH)
// @route   PATCH /api/vendors/:id
// @access  Admin
// ─────────────────────────────────────────────
const updateVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    res.status(200).json({ success: true, message: 'Vendor updated', data: vendor });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Delete a vendor
// @route   DELETE /api/vendors/:id
// @access  Admin
// ─────────────────────────────────────────────
const deleteVendor = async (req, res, next) => {
  try {
    const vendor = await Vendor.findByIdAndDelete(req.params.id);

    if (!vendor) {
      res.status(404);
      throw new Error('Vendor not found');
    }

    res.status(200).json({ success: true, message: 'Vendor deleted successfully' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllVendors,
  getVendorById,
  createVendor,
  updateVendor,
  deleteVendor,
};
