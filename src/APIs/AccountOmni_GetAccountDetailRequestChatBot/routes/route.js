const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF666 – Get account detail for ChatBot by accountNo
router.get('/tmf-api/accountManagement/v4/account/chatbot', controller.getAccountDetailChatBot);

// Legacy backward-compatible endpoint (if needed)
router.get('/api/AccountOMNI/GetAccountDetailRequestChatBot', controller.getAccountDetailChatBotLegacy);

module.exports = router;