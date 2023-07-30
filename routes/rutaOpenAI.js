// routes/openAIRoutes.js
const express = require('express');
const router = express.Router();
const openAIController = require('../controllers/openAIController');

router.post('/generate-text', openAIController.generateText);

module.exports = router;
