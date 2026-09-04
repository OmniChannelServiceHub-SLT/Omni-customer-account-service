const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF666-compliant account removal (POST kept, but TMF path)
//router.post('/tmf-api/accountManagement/v4/billingAccount/:id/terminate', controller.deleteAccount);
router.delete('/tmf-api/accountManagement/v4/billingAccount/:id', controller.deleteAccount);
module.exports = router;