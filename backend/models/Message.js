// ============================================
// Message Model (for real-time chat)
// ============================================

const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  // Reference to the sender
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Sender ID is required']
  },

  // Reference to the study group (chat room)
  groupId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'StudyGroup',
    required: [true, 'Group ID is required']
  },

  // Sender's display name (denormalized for performance)
  senderName: {
    type: String,
    default: ''
  },

  // Sender's avatar initials (denormalized for performance)
  senderAvatar: {
    type: String,
    default: ''
  },

  // Message content
  content: {
    type: String,
    required: [true, 'Message content is required'],
    maxlength: [2000, 'Message cannot exceed 2000 characters']
  },

  // Message type
  type: {
    type: String,
    enum: ['text', 'system', 'file'],
    default: 'text'
  }

}, {
  timestamps: true // createdAt serves as the timestamp
});

// Index for efficient chat history retrieval
messageSchema.index({ groupId: 1, createdAt: 1 });

module.exports = mongoose.model('Message', messageSchema);
