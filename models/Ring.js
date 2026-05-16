// ─────────────────────────────────────────────
//  models/Ring.js
//  Schema for wedding rings / jewelry
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const ringSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Ring name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: 0,
    },
    material: {
      type: String,
      enum: ['gold', 'silver', 'platinum', 'rose gold', 'other'],
      required: [true, 'Material is required'],
    },
    gemstone: {
      type: String, // e.g. 'Diamond', 'Sapphire', 'None'
      default: 'None',
    },
    sizes: {
      type: [Number], // Ring sizes e.g. [5, 6, 7, 8]
      default: [],
    },
    images: {
      type: [String],
      default: [],
    },
    inStock: {
      type: Boolean,
      default: true,
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
  },
  { timestamps: true }
);

module.exports = mongoose.model('Ring', ringSchema);
