// ─────────────────────────────────────────────
//  models/Dress.js
//  Schema for bridal / groom dresses
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const dressSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Dress name is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    category: {
      type: String,
      enum: ['bridal', 'groom', 'bridesmaid', 'other'],
      required: [true, 'Category is required'],
    },
    sizes: {
      type: [String], // e.g. ['S', 'M', 'L', 'XL']
      default: [],
    },
    colors: {
      type: [String], // e.g. ['White', 'Ivory', 'Champagne']
      default: [],
    },
    images: {
      type: [String], // Array of image URLs
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

module.exports = mongoose.model('Dress', dressSchema);
