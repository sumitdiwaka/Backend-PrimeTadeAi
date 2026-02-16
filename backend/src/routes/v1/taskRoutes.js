const express = require('express');
const router = express.Router();
const taskController = require('../../controllers/taskController');
const { protect, authorize } = require('../../middleware/auth');
const { validateTask } = require('../../middleware/validation');


console.log('Task Controller:', taskController);
console.log('createTask:', typeof taskController.createTask);
console.log('getTasks:', typeof taskController.getTasks);
console.log('getTask:', typeof taskController.getTask);
console.log('updateTask:', typeof taskController.updateTask);
console.log('deleteTask:', typeof taskController.deleteTask);


router.use(protect);

router.route('/')
  .post(validateTask, taskController.createTask)
  .get(taskController.getTasks);


router.route('/:id')
  .get(taskController.getTask)
  .put(validateTask, taskController.updateTask)
  .delete(taskController.deleteTask);


router.get('/admin/all', authorize('admin'), taskController.getTasks);

module.exports = router;