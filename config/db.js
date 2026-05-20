// ─────────────────────────────────────────────
//  config/db.js
//  Handles the MongoDB Atlas connection via Mongoose
//  Optimized for Vercel serverless (connection caching)
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

// Cache the connection promise so we don't reconnect on every
// serverless invocation (Vercel keeps the process warm between calls)
let cachedConnection = null;

const connectDB = async () => {
  // If already connected, reuse
  if (cachedConnection && mongoose.connection.readyState === 1) {
    console.log('♻️  Reusing existing MongoDB connection');
    return cachedConnection;
  }

  try {
    const uri = process.env.MONGO_URI;

    if (!uri) {
      throw new Error(
        'MONGO_URI is not defined — check your environment variables'
      );
    }

    console.log('🔌  Connecting to MongoDB Atlas...');

    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 10000, // 10s timeout for serverless cold starts
      socketTimeoutMS: 45000,          // Close sockets after 45s inactivity
    });

    cachedConnection = conn;
    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.error(`❌  MongoDB Connection Error: ${error.message}`);
    console.error(`❌  Full error:`, error);
    // Do NOT call process.exit(1) — it kills the serverless function.
    // Instead, throw so callers can handle it gracefully.
    throw error;
  }
};

module.exports = connectDB;
