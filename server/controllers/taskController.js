const Task = require('../models/Task');
const { getDBStatus } = require('../config/db');

// In-memory fallback store when MongoDB server is offline
let memoryTasks = [
  {
    _id: 'mem_1',
    title: 'Complete MERN Stack setup',
    description: 'Set up Express API, React Vite frontend, and MongoDB integration.',
    status: 'completed',
    priority: 'high',
    dueDate: new Date(Date.now() + 86400000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mem_2',
    title: 'Test Task CRUD operations',
    description: 'Verify Add, Edit, Delete, and Status update capabilities.',
    status: 'in_progress',
    priority: 'medium',
    dueDate: new Date(Date.now() + 172800000).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    _id: 'mem_3',
    title: 'Deploy and share project',
    description: 'Build production bundles and publish documentation.',
    status: 'pending',
    priority: 'low',
    dueDate: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// @desc    Get all tasks with optional filter, search, and sort
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const { status, priority, search, sortBy = 'createdAt', order = 'desc' } = req.query;

    if (getDBStatus()) {
      const query = {};

      if (status && status !== 'all') {
        query.status = status;
      }

      if (priority && priority !== 'all') {
        query.priority = priority;
      }

      if (search && search.trim() !== '') {
        query.$or = [
          { title: { $regex: search.trim(), $options: 'i' } },
          { description: { $regex: search.trim(), $options: 'i' } },
        ];
      }

      const sortOptions = {};
      sortOptions[sortBy] = order === 'asc' ? 1 : -1;

      const tasks = await Task.find(query).sort(sortOptions);

      return res.status(200).json({
        success: true,
        count: tasks.length,
        data: tasks,
      });
    }

    // In-memory fallback filtering
    let filtered = [...memoryTasks];

    if (status && status !== 'all') {
      filtered = filtered.filter((t) => t.status === status);
    }

    if (priority && priority !== 'all') {
      filtered = filtered.filter((t) => t.priority === priority);
    }

    if (search && search.trim() !== '') {
      const q = search.trim().toLowerCase();
      filtered = filtered.filter(
        (t) =>
          (t.title && t.title.toLowerCase().includes(q)) ||
          (t.description && t.description.toLowerCase().includes(q))
      );
    }

    filtered.sort((a, b) => {
      let valA = a[sortBy] || '';
      let valB = b[sortBy] || '';
      if (valA < valB) return order === 'asc' ? -1 : 1;
      if (valA > valB) return order === 'asc' ? 1 : -1;
      return 0;
    });

    res.status(200).json({
      success: true,
      count: filtered.length,
      data: filtered,
    });
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching tasks',
      error: error.message,
    });
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Public
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task not found with id: ${id}`,
        });
      }
      return res.status(200).json({ success: true, data: task });
    }

    const task = memoryTasks.find((t) => t._id === id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`,
      });
    }

    res.status(200).json({ success: true, data: task });
  } catch (error) {
    console.error('Error fetching task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching task',
      error: error.message,
    });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Task title is required',
      });
    }

    if (getDBStatus()) {
      const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'pending',
        priority: priority || 'medium',
        dueDate: dueDate || null,
      });

      return res.status(201).json({
        success: true,
        message: 'Task created successfully',
        data: task,
      });
    }

    const newTask = {
      _id: 'task_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
      title: title.trim(),
      description: description ? description.trim() : '',
      status: status || 'pending',
      priority: priority || 'medium',
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    memoryTasks.unshift(newTask);

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: newTask,
    });
  } catch (error) {
    console.error('Error creating task:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while creating task',
      error: error.message,
    });
  }
};

// @desc    Update an existing task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, status, priority, dueDate } = req.body;

    if (getDBStatus()) {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task not found with id: ${id}`,
        });
      }

      if (title !== undefined) task.title = title.trim();
      if (description !== undefined) task.description = description.trim();
      if (status !== undefined) task.status = status;
      if (priority !== undefined) task.priority = priority;
      if (dueDate !== undefined) task.dueDate = dueDate || null;

      const updatedTask = await task.save();

      return res.status(200).json({
        success: true,
        message: 'Task updated successfully',
        data: updatedTask,
      });
    }

    const taskIndex = memoryTasks.findIndex((t) => t._id === id);
    if (taskIndex === -1) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`,
      });
    }

    const existing = memoryTasks[taskIndex];
    const updated = {
      ...existing,
      title: title !== undefined ? title.trim() : existing.title,
      description: description !== undefined ? description.trim() : existing.description,
      status: status !== undefined ? status : existing.status,
      priority: priority !== undefined ? priority : existing.priority,
      dueDate: dueDate !== undefined ? dueDate : existing.dueDate,
      updatedAt: new Date().toISOString(),
    };

    memoryTasks[taskIndex] = updated;

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updated,
    });
  } catch (error) {
    console.error('Error updating task:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((val) => val.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }
    res.status(500).json({
      success: false,
      message: 'Server error while updating task',
      error: error.message,
    });
  }
};

// @desc    Delete a task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;

    if (getDBStatus()) {
      const task = await Task.findByIdAndDelete(id);
      if (!task) {
        return res.status(404).json({
          success: false,
          message: `Task not found with id: ${id}`,
        });
      }

      return res.status(200).json({
        success: true,
        message: 'Task deleted successfully',
        data: { id },
      });
    }

    const initialLength = memoryTasks.length;
    memoryTasks = memoryTasks.filter((t) => t._id !== id);

    if (memoryTasks.length === initialLength) {
      return res.status(404).json({
        success: false,
        message: `Task not found with id: ${id}`,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id },
    });
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting task',
      error: error.message,
    });
  }
};

// @desc    Get task statistics for summary cards
// @route   GET /api/tasks/stats/summary
// @access  Public
const getTaskStats = async (req, res) => {
  try {
    if (getDBStatus()) {
      const [total, pending, inProgress, completed, highPriority] = await Promise.all([
        Task.countDocuments({}),
        Task.countDocuments({ status: 'pending' }),
        Task.countDocuments({ status: 'in_progress' }),
        Task.countDocuments({ status: 'completed' }),
        Task.countDocuments({ priority: 'high', status: { $ne: 'completed' } }),
      ]);

      return res.status(200).json({
        success: true,
        data: {
          total,
          pending,
          inProgress,
          completed,
          highPriority,
        },
      });
    }

    const total = memoryTasks.length;
    const pending = memoryTasks.filter((t) => t.status === 'pending').length;
    const inProgress = memoryTasks.filter((t) => t.status === 'in_progress').length;
    const completed = memoryTasks.filter((t) => t.status === 'completed').length;
    const highPriority = memoryTasks.filter((t) => t.priority === 'high' && t.status !== 'completed').length;

    res.status(200).json({
      success: true,
      data: {
        total,
        pending,
        inProgress,
        completed,
        highPriority,
      },
    });
  } catch (error) {
    console.error('Error getting task stats:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching stats',
      error: error.message,
    });
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  getTaskStats,
};
