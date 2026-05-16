// ─────────────────────────────────────────────
//  config/db.js
//  Handles the MongoDB Atlas connection via Mongoose
// ─────────────────────────────────────────────

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      // These options prevent deprecation warnings
      serverSelectionTimeoutMS: 5000, // Timeout after 5s if no connection
    });

    console.log(`✅  MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌  MongoDB Connection Error: ${error.message}`);
    // Exit the process with failure so the server doesn't run without a DB
    process.exit(1);
  }
};

module.exports = connectDB;
