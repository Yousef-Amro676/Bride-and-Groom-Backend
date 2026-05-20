// ─────────────────────────────────────────────
//  controllers/adminController.js
//  Provides aggregate statistics for the Admin Dashboard
// ─────────────────────────────────────────────

const User = require('../models/User');
const Booking = require('../models/Booking');

const Vendor = require('../models/Vendor');
const Photographer = require('../models/Photographer');
const Planner = require('../models/Planner');
const HairStyle = require('../models/HairStyle');
const Dress = require('../models/Dress');

// ── GET /api/admin/dashboard
const getDashboardStats = async (req, res, next) => {
  try {
    // 1. Get simple counts for all our collections
    const userCount = await User.countDocuments();
    const vendorCount = await Vendor.countDocuments();
    const photographerCount = await Photographer.countDocuments();
    const plannerCount = await Planner.countDocuments();
    const hairStyleCount = await HairStyle.countDocuments();
    const dressCount = await Dress.countDocuments();

    // 2. Calculate total revenue from all bookings using a simple loop
    const bookings = await Booking.find({});
    let totalBookingRevenue = 0;
    for (let i = 0; i < bookings.length; i++) {
      totalBookingRevenue += bookings[i].totalPrice || 0;
    }



    res.status(200).json({
      success: true,
      data: {
        totalUsers: userCount,
        totalBookings: bookings.length,
        totalRevenue: totalBookingRevenue,
        counts: {
          vendors: vendorCount,
          photographers: photographerCount,
          planners: plannerCount,
          hairStyles: hairStyleCount,
          dresses: dressCount,
        }
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getDashboardStats
};
