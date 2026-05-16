// ─────────────────────────────────────────────
//  server.js
//  Entry point — connects DB and starts Express server
// ─────────────────────────────────────────────

const dotenv    = require('dotenv');
const connectDB = require('./config/db');
const app       = require('./app');

// Load environment variables FIRST before anything else
dotenv.config();

// Connect to MongoDB Atlas
connectDB();

// Start listening
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
