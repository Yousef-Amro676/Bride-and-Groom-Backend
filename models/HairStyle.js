// ─────────────────────────────────────────────
//  models/HairStyle.js
//  Schema for hair styling and makeup services
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const hairStyleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
    },
    description: {
      type: String,
      default: '',
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    salon: {
      type: String,
      required: [true, 'Salon or location is required'],
      trim: true,
    },
    images: {
      type: [String],
      default: [],
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('HairStyle', hairStyleSchema);
