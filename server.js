// ─────────────────────────────────────────────
//  server.js
//  Entry point — connects DB and starts Express server
//  Compatible with both local dev and Vercel serverless
// ─────────────────────────────────────────────

// Load environment variables FIRST, before any other module
// needs them (e.g., MONGO_URI, JWT_SECRET)
const dotenv = require('dotenv');
dotenv.config();

const connectDB = require('./config/db');
const app       = require('./app');

// ── Vercel serverless mode ───────────────────
// On Vercel, we export the app and let the platform handle requests.
// We still initiate the DB connection eagerly so it's cached.
connectDB().catch((err) => {
  console.error('⚠️  Initial DB connection failed (will retry on request):', err.message);
});

// ── Local dev mode ───────────────────────────
// Only start listening when NOT running on Vercel
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log('');
    console.log('══════════════════════════════════════');
    console.log(`  💍 Bride & Groom API`);
    console.log(`  🚀 Server: http://localhost:${PORT}`);
    console.log(`  🌍 Mode:   ${process.env.NODE_ENV}`);
    console.log('══════════════════════════════════════');
    console.log('');
  });
}

// Export app for Vercel's @vercel/node builder
module.exports = app;
