const express = require('express');
const controller = require('../controllers/getAccountDetailRequest.controller');

const router = express.Router();

// TMF666-compliant GET account by ID
router.get('/tmf-api/accountManagement/v4/billingAccount/:id', controller.getAccount);

module.exports = router;