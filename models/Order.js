// ─────────────────────────────────────────────
//  models/Order.js
//  Schema for user orders (dresses, rings, services)
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

// Sub-schema for each item in the order
const orderItemSchema = new mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    // ref is dynamic (Dress, Ring, Photographer, Planner)
    // We store itemType to know which collection to look up
  },
  itemType: {
    type: String,
    required: true,
    enum: ['Dress', 'Ring', 'Photographer', 'Planner', 'HairStyle'],
  },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, default: 1 },
});

const orderSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Order must belong to a user'],
    },
    items: {
      type: [orderItemSchema],
      required: true,
    },
    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
    eventDate: {
      type: Date,
    },
    notes: {
      type: String,
      default: '',
    },
    shippingAddress: {
      street:  { type: String },
      city:    { type: String },
      country: { type: String },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Order', orderSchema);
