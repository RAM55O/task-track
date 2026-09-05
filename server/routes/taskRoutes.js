const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
} = require('../controllers/taskController');

// Stats route (must be before /:id to avoid treating 'stats' as an ID)
router.get('/stats/summary', getTaskStats);

// Main collection routes
router.route('/')
  .get(getTasks)
  .post(createTask);

// Individual task routes
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
