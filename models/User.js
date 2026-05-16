// ─────────────────────────────────────────────
//  models/User.js
//  Schema for app users — includes bcrypt hashing
// ─────────────────────────────────────────────

const mongoose = require('mongoose');
const bcrypt   = require('bcryptjs');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
      select: false, // Never returned in queries unless explicitly requested
    },
    phone: {
      type: String,
      trim: true,
      default: '',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    profileImage: {
      type: String,
      default: '',
    },
    weddingDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

// ─────────────────────────────────────────────
//  Pre-save Hook — Hash password before saving
//  Only runs if the password field was modified
// ─────────────────────────────────────────────
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  const salt = await bcrypt.genSalt(10); // Cost factor of 10 is the industry standard
  this.password = await bcrypt.hash(this.password, salt);
});

// ─────────────────────────────────────────────
//  Instance Method — Compare entered password
//  with the stored hashed password
// ─────────────────────────────────────────────
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
