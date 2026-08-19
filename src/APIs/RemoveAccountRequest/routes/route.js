const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF666-compliant account removal (POST kept, but TMF path)
router.post('/tmf-api/accountManagement/v4/account/:id/terminate', controller.deleteAccount);

module.exports = router;