// ─────────────────────────────────────────────
//  seed.js
//  Populates MongoDB with sample vendors and an admin user.
//  Run once with:  node seed.js
//  To clear all:   node seed.js --clear
// ─────────────────────────────────────────────

const mongoose = require('mongoose');
const dotenv   = require('dotenv');

dotenv.config();

const User   = require('./models/User');
const Vendor = require('./models/Vendor');

// ── Sample Vendors ────────────────────────────
const sampleVendors = [
  // ===================== DRESSES =====================
  {
    vendorName:  'Elegance Bridal House',
    category:    'dress',
    description: 'Exclusive bridal gowns and tuxedos. Custom tailoring available.',
    location:    'Cairo',
    price:       8500,
    phone:       '+201009876541',
    email:       'info@elegancebridal.com',
    rating:      4.6,
    numReviews:  28,
    available:   true,
    image:       'assets/fonts/images/W_1.png',
  },
  {
    vendorName:  'Royal Wedding Gowns',
    category:    'dress',
    description: 'Imported and local designer dresses for your special day.',
    location:    'Alexandria',
    price:       12000,
    phone:       '+201009876542',
    email:       'sales@royalwedding.com',
    rating:      4.9,
    numReviews:  45,
    available:   true,
    image:       'assets/fonts/images/W_2.png',
  },
  {
    vendorName:  'White Swan Boutique',
    category:    'dress',
    description: 'Affordable, elegant, and timeless wedding dresses.',
    location:    'Giza',
    price:       5500,
    phone:       '+201009876543',
    email:       'contact@whiteswan.com',
    rating:      4.5,
    numReviews:  12,
    available:   true,
    image:       'assets/fonts/images/W_3.png',
  },
  {
    vendorName:  'Velvet & Lace Atelier',
    category:    'dress',
    description: 'Handcrafted lace dresses with vintage and modern twists.',
    location:    'Mansoura',
    price:       9000,
    phone:       '+201009876544',
    email:       'hello@velvetlace.com',
    rating:      4.8,
    numReviews:  34,
    available:   true,
    image:       'assets/fonts/images/img_1.png',
  },

  // ===================== PHOTOGRAPHERS =====================
  {
    vendorName:  'Ahmed Photography Studio',
    category:    'photographer',
    description: 'Award-winning wedding photographer. Specializes in candid styles.',
    location:    'Cairo',
    price:       3500,
    phone:       '+201001234561',
    email:       'ahmed@photostudio.com',
    rating:      4.8,
    numReviews:  42,
    available:   true,
    image:       'assets/fonts/images/P_1.png',
  },
  {
    vendorName:  'Cinema Weddings',
    category:    'photographer',
    description: 'Cinematic wedding photography and drone footage.',
    location:    'Cairo',
    price:       4500,
    phone:       '+201661234562',
    email:       'film@cinemaweddings.com',
    rating:      4.7,
    numReviews:  24,
    available:   true,
    image:       'assets/fonts/images/P_2.png',
  },
  {
    vendorName:  'Memories Captured',
    category:    'photographer',
    description: 'Professional lighting and creative poses for your big day.',
    location:    'Alexandria',
    price:       3000,
    phone:       '+201661234563',
    email:       'smile@memories.com',
    rating:      4.9,
    numReviews:  88,
    available:   true,
    image:       'assets/fonts/images/P_3.png',
  },
  {
    vendorName:  'Golden Hour Snaps',
    category:    'photographer',
    description: 'Outdoor specialist, capturing perfect moments at sunset.',
    location:    'Hurghada',
    price:       5000,
    phone:       '+201661234564',
    email:       'golden@hoursnaps.com',
    rating:      4.6,
    numReviews:  19,
    available:   true,
    image:       'assets/fonts/images/P_4.png',
  },

  // ===================== WEDDING PLANNERS =====================
  {
    vendorName:  'Dream Planners Co.',
    category:    'planner',
    description: 'Full-service wedding planning from venue selection to coordination.',
    location:    'Alexandria',
    price:       15000,
    phone:       '+201112345671',
    email:       'hello@dreamplanners.com',
    rating:      4.9,
    numReviews:  67,
    available:   true,
    image:       'assets/fonts/images/C_1.png',
  },
  {
    vendorName:  'Perfect Day Events',
    category:    'planner',
    description: 'Expert event management with a focus on luxury weddings.',
    location:    'Cairo',
    price:       20000,
    phone:       '+201112345672',
    email:       'info@perfectday.com',
    rating:      4.8,
    numReviews:  55,
    available:   true,
    image:       'assets/fonts/images/C_2.png',
  },
  {
    vendorName:  'Fairy Tale Weddings',
    category:    'planner',
    description: 'Turning your dream wedding into a reality with custom themes.',
    location:    'Giza',
    price:       12000,
    phone:       '+201112345673',
    email:       'magic@fairytale.com',
    rating:      4.7,
    numReviews:  31,
    available:   true,
    image:       'assets/fonts/images/C_3.png',
  },
  {
    vendorName:  'Elite Event Organizers',
    category:    'planner',
    description: 'Stress-free coordination for large scale wedding ceremonies.',
    location:    'Sharm El-Sheikh',
    price:       25000,
    phone:       '+201112345674',
    email:       'elite@organizers.com',
    rating:      5.0,
    numReviews:  112,
    available:   true,
    image:       'assets/fonts/images/C_4.png',
  },

  // ===================== HAIR & MAKEUP =====================
  {
    vendorName:  'Glamour Beauty Studio',
    category:    'hair & makeup',
    description: 'Professional bridal hair and makeup. On-location services available.',
    location:    'Alexandria',
    price:       3500,
    phone:       '+201551234561',
    email:       'glamour@beauty.com',
    rating:      4.8,
    numReviews:  88,
    available:   true,
    image:       'assets/fonts/images/h_1.png',
  },
  {
    vendorName:  'Flawless Faces',
    category:    'hair & makeup',
    description: 'Expert makeup artists specializing in long-lasting bridal looks.',
    location:    'Cairo',
    price:       4000,
    phone:       '+201551234562',
    email:       'book@flawlessfaces.com',
    rating:      4.9,
    numReviews:  104,
    available:   true,
    image:       'assets/fonts/images/h_2.png',
  },
  {
    vendorName:  'Bridal Glow Salon',
    category:    'hair & makeup',
    description: 'Complete bridal packages including hair styling, makeup, and nails.',
    location:    'Giza',
    price:       5500,
    phone:       '+201551234563',
    email:       'hello@bridalglow.com',
    rating:      4.7,
    numReviews:  45,
    available:   true,
    image:       'assets/fonts/images/h_3.png',
  },
  {
    vendorName:  'Elegance Spa & Beauty',
    category:    'hair & makeup',
    description: 'Pre-wedding spa treatments combined with expert bridal makeup.',
    location:    'Cairo',
    price:       6000,
    phone:       '+201551234564',
    email:       'relax@elegancespa.com',
    rating:      4.6,
    numReviews:  22,
    available:   true,
    image:       'assets/fonts/images/beauty_1.png',
  },
];

// ── Admin User ────────────────────────────────
const adminUser = {
  name:     'Admin',
  email:    'admin@brideandgroom.com',
  password: 'admin123456',
  role:     'admin',
  phone:    '+201000000000',
};

// ── Seed Function ─────────────────────────────
const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅  MongoDB connected');

    if (process.argv[2] === '--clear') {
      // Clear all collections
      await User.deleteMany({});
      await Vendor.deleteMany({});
      console.log('🗑️   All data cleared');
      process.exit(0);
    }

    // Clear existing data
    await User.deleteMany({});
    await Vendor.deleteMany({});
    console.log('🗑️   Existing data cleared');

    // Seed admin user (password hashed by pre-save hook)
    await User.create(adminUser);
    console.log('👤  Admin user created → admin@brideandgroom.com / admin123456');

    // Seed vendors
    await Vendor.insertMany(sampleVendors);
    console.log(`🏪  ${sampleVendors.length} vendors seeded`);

    console.log('');
    console.log('✅  Database seeded successfully!');
    console.log('');
    process.exit(0);
  } catch (error) {
    console.error('❌  Seeding failed:', error.message);
    process.exit(1);
  }
};

seedDB();
