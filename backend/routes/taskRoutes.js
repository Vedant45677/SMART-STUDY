// ============================================
// Task Routes
// ============================================

const express = require('express');
const router = express.Router();
const { createTask, getTasks, updateTask, deleteTask } = require('../controllers/taskController');
const { protect } = require('../middleware/auth');

// All task routes require authentication
router.use(protect);

// POST   /api/tasks      — Create a new task
router.post('/', createTask);

// GET    /api/tasks      — Get all tasks for the user
router.get('/', getTasks);

// PUT    /api/tasks/:id  — Update a task
router.put('/:id', updateTask);

// DELETE /api/tasks/:id  — Delete a task
router.delete('/:id', deleteTask);

module.exports = router;
