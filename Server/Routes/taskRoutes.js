const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
const taskController = require('../Controllers/taskController.js');
const {verifyTokenMiddleware} = require('../Controllers/helpers/verifyToken.js');

router.post('/',verifyTokenMiddleware, taskController.createTask);

router.get('/:profileId',verifyTokenMiddleware, taskController.getTasks);

router.get('/:taskId',verifyTokenMiddleware, taskController.getTask);

router.put('/:taskId',verifyTokenMiddleware, taskController.updateTask);

router.delete('/:taskId',verifyTokenMiddleware, taskController.deleteTask);

module.exports = router;