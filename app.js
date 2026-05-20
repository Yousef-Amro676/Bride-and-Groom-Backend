
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const app = express();

// ─────────────────────────────────────────────
//  Global Middleware
// ─────────────────────────────────────────────

// Enable Cross-Origin Resource Sharing (required for Flutter app)
app.use(cors());

// Parse incoming JSON bodies
app.use(express.json());

// Parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));

// ─────────────────────────────────────────────
//  Ensure MongoDB is connected before handling
//  any API request (critical for Vercel serverless
//  where the first request may arrive before the
//  eager connection in server.js completes)
// ─────────────────────────────────────────────
app.use('/api', async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      console.log('⏳ MongoDB not ready (state:', mongoose.connection.readyState, ') — reconnecting...');
      await connectDB();
    }
    next();
  } catch (error) {
    console.error('🔴 DB middleware — connection failed:', error.message);
    return res.status(503).json({
      success: false,
      message: 'Database connection unavailable — please try again shortly',
    });
  }
});

//check
app.get('/', (req, res) => {
  res.status(200).json({
    success: true,
    message: '💍 Bride & Groom API is running',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    endpoints: {
      users: '/api/users',
      vendors: '/api/vendors',
      bookings: '/api/bookings',
      dresses: '/api/dresses',
      photographers: '/api/photographers',
      planners: '/api/planners',
      hairstyles: '/api/hairstyles',
    },
  });
});

//  API Routes

app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/vendors', require('./routes/vendorRoutes'));
app.use('/api/bookings', require('./routes/bookingRoutes'));

app.use('/api/dresses', require('./routes/dressRoutes'));
app.use('/api/photographers', require('./routes/photographerRoutes'));
app.use('/api/planners', require('./routes/plannerRoutes'));
app.use('/api/hairstyles', require('./routes/hairStyleRoutes'));

// Admin
app.use('/api/admin', require('./routes/adminRoutes'));


//  404 Handler — unknown routes
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});


const errorHandler = require('./middleware/errorHandler');
app.use(errorHandler);

module.exports = app;
