const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();
const resolveClientType = require('../../../common/middleware/resolveClientType');


// TMF666 – Get account detail for ChatBot by accountNo
router.get('/tmf-api/accountManagement/v4/account/chatbot',resolveClientType, controller.getAccountDetailChatBot);

// Legacy backward-compatible endpoint (if needed)
router.get('/api/AccountOMNI/GetAccountDetailRequestChatBot', resolveClientType,controller.getAccountDetailChatBot);

module.exports = router;