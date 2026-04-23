// ============================================
// Task Model
// ============================================

const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  // Reference to the user who owns this task
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Task title
  title: {
    type: String,
    required: [true, 'Task title is required'],
    trim: true,
    maxlength: [200, 'Title cannot exceed 200 characters']
  },

  // Task description
  description: {
    type: String,
    maxlength: [1000, 'Description cannot exceed 1000 characters'],
    default: ''
  },

  // Related subject
  subject: {
    type: String,
    trim: true,
    default: ''
  },

  // Task completion status
  status: {
    type: String,
    enum: ['pending', 'in-progress', 'completed'],
    default: 'pending'
  },

  // Priority level
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },

  // Deadline
  deadline: {
    type: Date,
    default: null
  }

}, {
  timestamps: true
});

// Index for efficient queries by user
taskSchema.index({ userId: 1, status: 1 });

module.exports = mongoose.model('Task', taskSchema);
