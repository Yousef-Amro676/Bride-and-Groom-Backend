// ─────────────────────────────────────────────
//  controllers/bookingController.js
//  Manages bookings between users and services with polymorphic population
// ─────────────────────────────────────────────

const Booking = require('../models/Booking');
const mongoose = require('mongoose');

// ─────────────────────────────────────────────
// No complex population helper needed anymore. 
// We save itemName directly in the booking to keep it simple!
// ─────────────────────────────────────────────

// ─────────────────────────────────────────────
// @desc    Get all bookings (admin)
// @route   GET /api/bookings
// @access  Admin
// ─────────────────────────────────────────────
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({})
      .populate('user', 'name email phone') // Populate standard user details
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get single booking by ID
// @route   GET /api/bookings/:id
// @access  Protected
// ─────────────────────────────────────────────
const getBookingById = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate('user', 'name email');

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.status(200).json({ success: true, data: booking });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Get all bookings for a specific user
// @route   GET /api/bookings/my/:userId
// @access  Protected
// ─────────────────────────────────────────────
const getUserBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ user: req.params.userId })
      .sort({ eventDate: 1 });

    res.status(200).json({ success: true, count: bookings.length, data: bookings });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Protected
// ─────────────────────────────────────────────
const createBooking = async (req, res, next) => {
  try {
    const { itemId, itemType, eventDate, notes, userId } = req.body;

    // Beginner-friendly architecture: All items (Photographer, Planner, Dress, etc.) 
    // are now unified under the Vendor model!
    const Model = require('../models/Vendor');

    // 1. Check if the item actually exists in the database
    const item = await Model.findById(itemId);
    if (!item) {
      res.status(404);
      throw new Error(`${itemType} not found`);
    }

    // 2. Check if the item is available to be booked
    if (item.available !== undefined && !item.available) {
      res.status(400);
      throw new Error(`This ${itemType.toLowerCase()} is currently not available for bookings`);
    }

    // 3. Get the correct price depending on what we are booking
    const price = item.price || item.pricePerDay || item.pricePackage || 0;
    // 4. Get the name of the service/item so we can save it directly
    const itemName = item.name || item.vendorName || 'Unknown Service';

    // 5. Create the booking
    const booking = await Booking.create({
      user: userId,
      itemId,
      itemType,
      itemName, // Save the name directly!
      eventDate,
      notes,
      totalPrice: price,   // Snapshot the price at booking time
    });

    res.status(201).json({
      success: true,
      message: 'Booking created successfully',
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Update booking status (admin)
// @route   PATCH /api/bookings/:id
// @access  Admin
// ─────────────────────────────────────────────
const updateBookingStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus } = req.body;

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status, paymentStatus },
      { new: true, runValidators: true }
    );

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.status(200).json({ success: true, message: 'Booking updated', data: booking });
  } catch (error) {
    next(error);
  }
};

// ─────────────────────────────────────────────
// @desc    Cancel / delete a booking
// @route   DELETE /api/bookings/:id
// @access  Protected
// ─────────────────────────────────────────────
const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);

    if (!booking) {
      res.status(404);
      throw new Error('Booking not found');
    }

    res.status(200).json({ success: true, message: 'Booking cancelled' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getAllBookings,
  getBookingById,
  getUserBookings,
  createBooking,
  updateBookingStatus,
  deleteBooking,
};
