const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF-style VAS account creation (POST kept, path under accountManagement)
router.post('/tmf-api/accountManagement/v4/vasAccount', controller.createVasAccount);

module.exports = router;