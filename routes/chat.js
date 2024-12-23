const express = require('express');
const chatController = require('../controller/chat'); // Correct path to your controller
const { Authorize } = require('../middleware/auth'); // Correct path to your middleware
const router = express.Router();

router.post('/message',Authorize, chatController.message); // Ensure these functions are correctly imported

module.exports = router;
