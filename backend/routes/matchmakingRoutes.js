// ============================================
// AI Matchmaking Routes
// ============================================

const express = require('express');
const router = express.Router();
const { getMatches } = require('../controllers/matchmakingController');
const { protect } = require('../middleware/auth');

// GET /api/matchmaking — Get AI-powered user and group matches
router.get('/', protect, getMatches);

module.exports = router;
