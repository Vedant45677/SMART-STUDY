// ============================================
// Chat Routes (REST endpoints)
// ============================================

const express = require('express');
const router = express.Router();
const { getChatHistory, sendMessage } = require('../controllers/chatController');
const { protect } = require('../middleware/auth');

// All chat routes require authentication
router.use(protect);

// GET  /api/chat/:groupId  — Get chat history for a group
router.get('/:groupId', getChatHistory);

// POST /api/chat/:groupId  — Send a message (REST fallback)
router.post('/:groupId', sendMessage);

module.exports = router;
