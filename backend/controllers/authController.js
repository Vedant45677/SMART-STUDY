// ============================================
// Authentication Controller
// ============================================

const User = require('../models/User');
const { generateToken, asyncHandler } = require('../utils/helpers');

/**
 * @desc    Register a new user
 * @route   POST /api/auth/signup
 * @access  Public
 */
const signup = asyncHandler(async (req, res) => {
  const { name, email, password, subjects, availability, university, major, level, avatar, studyPreferences } = req.body;

  // Check if user already exists
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({
      success: false,
      message: 'A user with this email already exists.'
    });
  }

  // Create user
  const user = await User.create({
    name,
    email,
    password,
    subjects: subjects || [],
    availability: availability || [],
    university: university || '',
    major: major || '',
    level: level || '',
    avatar: avatar || name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2),
    studyPreferences: studyPreferences || ''
  });

  // Generate JWT token
  const token = generateToken(user._id);

  // Return user data (without password)
  res.status(201).json({
    success: true,
    message: 'Account created successfully!',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      availability: user.availability,
      university: user.university,
      major: user.major,
      level: user.level,
      avatar: user.avatar,
      studyHours: user.studyHours,
      groupsJoined: user.groupsJoined,
      tasksCompleted: user.tasksCompleted,
      streak: user.streak,
      bio: user.bio,
      createdAt: user.createdAt
    }
  });
});

/**
 * @desc    Login user & return JWT token
 * @route   POST /api/auth/login
 * @access  Public
 */
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide email and password.'
    });
  }

  // Find user and include password field for comparison
  const user = await User.findOne({ email }).select('+password');

  if (!user) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Check password
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(401).json({
      success: false,
      message: 'Invalid email or password.'
    });
  }

  // Generate token
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    message: 'Login successful!',
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      subjects: user.subjects,
      availability: user.availability,
      university: user.university,
      major: user.major,
      level: user.level,
      avatar: user.avatar,
      studyHours: user.studyHours,
      groupsJoined: user.groupsJoined,
      tasksCompleted: user.tasksCompleted,
      streak: user.streak,
      bio: user.bio,
      createdAt: user.createdAt
    }
  });
});

module.exports = { signup, login };
