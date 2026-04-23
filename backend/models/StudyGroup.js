// ============================================
// Study Group Model
// ============================================

const mongoose = require('mongoose');

const studyGroupSchema = new mongoose.Schema({
  // Group name
  name: {
    type: String,
    required: [true, 'Group name is required'],
    trim: true,
    maxlength: [100, 'Group name cannot exceed 100 characters']
  },

  // Primary subject
  subject: {
    type: String,
    required: [true, 'Subject is required'],
    trim: true
  },

  // Description of the group
  description: {
    type: String,
    maxlength: [500, 'Description cannot exceed 500 characters'],
    default: ''
  },

  // Members array (references to User model)
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],

  // Maximum number of members allowed
  maxMembers: {
    type: Number,
    default: 10,
    min: [2, 'Group must allow at least 2 members'],
    max: [50, 'Group cannot exceed 50 members']
  },

  // Study schedule
  schedule: {
    type: String,
    default: ''
  },

  // Difficulty level
  level: {
    type: String,
    enum: ['Beginner', 'Intermediate', 'Advanced', ''],
    default: ''
  },

  // Tags for search/filter
  tags: {
    type: [String],
    default: []
  },

  // Group avatar/emoji
  avatar: {
    type: String,
    default: '📚'
  },

  // Creator of the group
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }

}, {
  timestamps: true
});

// Virtual: member count
studyGroupSchema.virtual('memberCount').get(function () {
  return this.members.length;
});

// Ensure virtuals are included in JSON output
studyGroupSchema.set('toJSON', { virtuals: true });
studyGroupSchema.set('toObject', { virtuals: true });

module.exports = mongoose.model('StudyGroup', studyGroupSchema);
