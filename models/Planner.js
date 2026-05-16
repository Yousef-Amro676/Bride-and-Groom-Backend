// ─────────────────────────────────────────────
//  models/Planner.js
//  Schema for wedding planners / coordinators
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const plannerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Planner name is required'],
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
    pricePackage: {
      type: Number,
      required: [true, 'Package price is required'],
      min: 0,
    },
    services: {
      type: [String], // e.g. ['Full Planning', 'Day Coordination', 'Venue Scouting']
      default: [],
    },
    profileImage: {
      type: String,
      default: '',
    },
    yearsOfExperience: {
      type: Number,
      default: 0,
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

module.exports = mongoose.model('Planner', plannerSchema);
