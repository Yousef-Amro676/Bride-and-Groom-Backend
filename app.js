
const express = require('express');
const cors = require('cors');

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
