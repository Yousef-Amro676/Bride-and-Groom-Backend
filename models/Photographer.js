// ─────────────────────────────────────────────
//  models/Photographer.js
//  Schema for wedding photographers
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const photographerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Photographer name is required'],
      trim: true,
    },
    bio: {
      type: String,
      default: '',
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
    location: {
      type: String,
      trim: true,
    },
    pricePerDay: {
      type: Number,
      required: [true, 'Price per day is required'],
      min: 0,
    },
    specialties: {
      type: [String], // e.g. ['Wedding', 'Portrait', 'Aerial']
      default: [],
    },
    portfolio: {
      type: [String], // Array of image/video URLs
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
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

module.exports = mongoose.model('Photographer', photographerSchema);
