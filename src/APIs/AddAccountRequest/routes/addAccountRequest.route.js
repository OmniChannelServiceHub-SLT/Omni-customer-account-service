const express = require('express');
const controller = require('../controllers/addAccountRequest.controller');

const router = express.Router();

// TMF666-compliant account creation
router.post('/tmf-api/accountManagement/v4/account', controller.createAccount);

module.exports = router;