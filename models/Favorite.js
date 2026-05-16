// ─────────────────────────────────────────────
//  models/Favorite.js
//  Schema for tracking user's favorite items
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const favoriteSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Favorite must belong to a user'],
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    itemType: {
      type: String,
      required: true,
      enum: ['Dress', 'Photographer', 'Planner', 'HairStyle', 'Ring', 'Vendor'],
    },
  },
  { timestamps: true }
);

// Prevent a user from favoriting the exact same item multiple times
favoriteSchema.index({ user: 1, itemId: 1 }, { unique: true });

module.exports = mongoose.model('Favorite', favoriteSchema);
