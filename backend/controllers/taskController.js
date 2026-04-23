// ============================================
// Task Controller
// ============================================

const Task = require('../models/Task');
const { asyncHandler } = require('../utils/helpers');

/**
 * @desc    Create a new task
 * @route   POST /api/tasks
 * @access  Private
 */
const createTask = asyncHandler(async (req, res) => {
  const { title, description, subject, priority, deadline } = req.body;

  const task = await Task.create({
    userId: req.user._id,
    title,
    description: description || '',
    subject: subject || '',
    priority: priority || 'medium',
    deadline: deadline || null
  });

  res.status(201).json({
    success: true,
    message: 'Task created successfully!',
    task
  });
});

/**
 * @desc    Get all tasks for the authenticated user
 * @route   GET /api/tasks
 * @access  Private
 */
const getTasks = asyncHandler(async (req, res) => {
  const { status, priority, subject } = req.query;

  // Build filter
  const filter = { userId: req.user._id };
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (subject) filter.subject = { $regex: subject, $options: 'i' };

  const tasks = await Task.find(filter).sort({ deadline: 1, createdAt: -1 });

  // Calculate stats
  const allTasks = await Task.find({ userId: req.user._id });
  const stats = {
    total: allTasks.length,
    completed: allTasks.filter(t => t.status === 'completed').length,
    pending: allTasks.filter(t => t.status === 'pending').length,
    inProgress: allTasks.filter(t => t.status === 'in-progress').length
  };

  res.status(200).json({
    success: true,
    count: tasks.length,
    stats,
    tasks
  });
});

/**
 * @desc    Update a task (status, title, etc.)
 * @route   PUT /api/tasks/:id
 * @access  Private
 */
const updateTask = asyncHandler(async (req, res) => {
  let task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found.'
    });
  }

  // Ensure user owns this task
  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to update this task.'
    });
  }

  // Update allowed fields
  const allowedFields = ['title', 'description', 'subject', 'status', 'priority', 'deadline'];
  const updateData = {};
  for (const field of allowedFields) {
    if (req.body[field] !== undefined) {
      updateData[field] = req.body[field];
    }
  }

  task = await Task.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true
  });

  res.status(200).json({
    success: true,
    message: 'Task updated successfully!',
    task
  });
});

/**
 * @desc    Delete a task
 * @route   DELETE /api/tasks/:id
 * @access  Private
 */
const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);

  if (!task) {
    return res.status(404).json({
      success: false,
      message: 'Task not found.'
    });
  }

  // Ensure user owns this task
  if (task.userId.toString() !== req.user._id.toString()) {
    return res.status(403).json({
      success: false,
      message: 'Not authorized to delete this task.'
    });
  }

  await Task.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'Task deleted successfully!'
  });
});

module.exports = { createTask, getTasks, updateTask, deleteTask };
