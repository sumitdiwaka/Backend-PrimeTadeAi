const Task = require('../models/Task');
const logger = require('../utils/logger');

exports.createTask = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    const task = await Task.create(req.body);
    
    logger.info(`Task created: "${task.title}" by user: ${req.user.email}`);

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error(`Task creation error for user ${req.user.email}: ${error.message}`);
    next(error);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    let query;
    
    if (req.user.role === 'admin') {
      query = Task.find().populate('user', 'name email');
      logger.info(`Admin ${req.user.email} fetched all tasks`);
    } else {
      query = Task.find({ user: req.user.id });
      logger.info(`User ${req.user.email} fetched their tasks`);
    }
    
    const tasks = await query;
    
    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    logger.error(`Error fetching tasks for user ${req.user.email}: ${error.message}`);
    next(error);
  }
};

exports.getTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id).populate('user', 'name email');
    
    if (!task) {
      logger.error(`Task not found: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    if (task.user._id.toString() !== req.user.id && req.user.role !== 'admin') {
      logger.error(`Unauthorized task access by ${req.user.email} to task ${req.params.id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to access this task'
      });
    }
    
    logger.info(`Task accessed: ${task.title} by ${req.user.email}`);
    
    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error(`Error fetching task: ${error.message}`);
    next(error);
  }
};

exports.updateTask = async (req, res, next) => {
  try {
    let task = await Task.findById(req.params.id);
    
    if (!task) {
      logger.error(`Task not found for update: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      logger.error(`Unauthorized task update by ${req.user.email} to task ${req.params.id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }
    
    task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    logger.info(`Task updated: "${task.title}" by ${req.user.email}`);

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    logger.error(`Error updating task: ${error.message}`);
    next(error);
  }
};

exports.deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      logger.error(`Task not found for deletion: ${req.params.id}`);
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }
    
    if (task.user.toString() !== req.user.id && req.user.role !== 'admin') {
      logger.error(`Unauthorized task deletion by ${req.user.email} to task ${req.params.id}`);
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }
    
    await task.deleteOne();
    
    logger.info(`Task deleted: "${task.title}" by ${req.user.email}`);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully'
    });
  } catch (error) {
    logger.error(`Error deleting task: ${error.message}`);
    next(error);
  }
};