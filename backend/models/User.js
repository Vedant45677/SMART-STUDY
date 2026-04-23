// ============================================
// User Model
// ============================================

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic info
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, 'Please provide a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters'],
    select: false // Don't return password in queries by default
  },

  // Academic info
  university: {
    type: String,
    trim: true,
    default: ''
  },
  major: {
    type: String,
    trim: true,
    default: ''
  },
  level: {
    type: String,
    trim: true,
    default: ''
  },
  bio: {
    type: String,
    maxlength: [500, 'Bio cannot exceed 500 characters'],
    default: ''
  },

  // Study preferences
  subjects: {
    type: [String],
    default: []
  },
  availability: {
    type: [String], // e.g., ['Morning (6am – 12pm)', 'Evening (6pm – 10pm)']
    default: []
  },
  studyPreferences: {
    type: String,
    enum: ['Morning (6am – 12pm)', 'Afternoon (12pm – 6pm)', 'Evening (6pm – 10pm)', 'Night (10pm+)', 'Flexible', ''],
    default: ''
  },

  // Avatar initials (e.g., "AJ")
  avatar: {
    type: String,
    default: ''
  },

  // Stats (tracked on frontend, stored for persistence)
  studyHours: { type: Number, default: 0 },
  groupsJoined: { type: Number, default: 0 },
  tasksCompleted: { type: Number, default: 0 },
  streak: { type: Number, default: 0 }

}, {
  timestamps: true // Adds createdAt and updatedAt automatically
});

// ---- Pre-save Hook: Hash password before saving ----
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) return next();

  const salt = await bcrypt.genSalt(12);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// ---- Instance Method: Compare entered password with hashed password ----
userSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
