// ─────────────────────────────────────────────
//  models/Booking.js
//  Schema for user bookings (Services)
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    // The user who made the booking
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },

    // Simple ID reference to the service/item being booked
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, 'Booking must reference an item ID'],
    },
    // What kind of service is this? (e.g., 'Photographer', 'Planner')
    itemType: {
      type: String,
      required: true,
      enum: ['Photographer', 'Planner', 'HairStyle', 'Vendor', 'Dress'],
    },
    // We store the name directly here so it's easy to show in the UI 
    // without doing complex database 'populate' operations.
    itemName: {
      type: String,
      default: 'Service',
    },

    // Wedding / event date
    eventDate: {
      type: Date,
      required: [true, 'Event date is required'],
    },

    // Extra notes / requirements from user
    notes: {
      type: String,
      default: '',
    },

    // Agreed price at the time of booking
    totalPrice: {
      type: Number,
      required: [true, 'Total price is required'],
      min: 0,
    },

    // Booking workflow status
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'in-progress', 'completed', 'cancelled'],
      default: 'pending',
    },

    // Payment tracking
    paymentStatus: {
      type: String,
      enum: ['unpaid', 'paid', 'refunded'],
      default: 'unpaid',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Booking', bookingSchema);
