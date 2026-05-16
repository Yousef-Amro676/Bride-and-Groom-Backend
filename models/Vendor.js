// ─────────────────────────────────────────────
//  models/Vendor.js
//  Unified vendor schema — covers photographers,
//  planners, dress shops, rings, florists, caterers, etc.
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const vendorSchema = new mongoose.Schema(
  {
    vendorName: {
      type: String,
      required: [true, 'Vendor name is required'],
      trim: true,
    },

    category: {
      type: String,
      required: [true, 'Category is required'],
      // All supported categories for the Bride & Groom app
      enum: [
        'photographer',
        'planner',
        'dress',
        'ring',
        'florist',
        'catering',
        'hair & makeup',
        'videographer',
        'venue',
        'other',
      ],
      lowercase: true,
    },

    description: {
      type: String,
      default: '',
    },

    location: {
      type: String,
      required: [true, 'Location is required'],
      trim: true,
      lowercase: true, // store lowercase so filtering is easy
    },

    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },

    image: {
      type: String, // URL to the vendor's main image
      default: '',
    },

    images: {
      type: [String], // Gallery
      default: [],
    },

    phone: {
      type: String,
      trim: true,
    },

    email: {
      type: String,
      lowercase: true,
      trim: true,
    },

    rating: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    available: {
      type: Boolean,
      default: true,
    },

    // The user/admin who created this vendor listing
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt automatically
  }
);

// ── Index for fast filtering by category and location
vendorSchema.index({ category: 1, location: 1 });
vendorSchema.index({ price: 1 });

module.exports = mongoose.model('Vendor', vendorSchema);
