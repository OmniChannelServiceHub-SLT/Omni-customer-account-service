const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF629-compliant GET customer by NIC
router.get('/tmf-api/customerManagement/v4/customer', controller.checkExistCustomer);

module.exports = router;