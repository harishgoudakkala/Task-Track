const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser')
router.use(bodyParser.urlencoded({ extended: false }))
router.use(bodyParser.json())
const taskController = require('../Controllers/taskController.js');
const {verifyTokenMiddleware} = require('../Controllers/helpers/verifyToken.js');

router.get('/',verifyTokenMiddleware, taskController.getProfiles);

module.exports = router;