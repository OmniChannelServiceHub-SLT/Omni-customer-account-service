const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF666-compliant BillingAccount update
router.patch('/tmf-api/accountManagement/v4/billingAccount/:id', controller.patchAccount);

module.exports = router;