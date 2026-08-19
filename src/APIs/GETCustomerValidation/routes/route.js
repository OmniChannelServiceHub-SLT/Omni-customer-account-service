const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF629-compliant GET customer validation by telephone
router.get('/tmf-api/customerManagement/v4/customer/validate', controller.validateCustomer);

module.exports = router;