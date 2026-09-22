const express = require('express');
const controller = require('../controllers/controller');
const resolveClientType = require('../../../common/middleware/resolveClientType');
const router = express.Router();

// TMF629-compliant GET customer by NIC
router.get('/tmf-api/customerManagement/v4/customer',resolveClientType, controller.checkExistCustomer);

module.exports = router;