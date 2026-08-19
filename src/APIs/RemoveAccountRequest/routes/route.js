const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF666-compliant DELETE account
router.delete('/tmf-api/accountManagement/v4/account/:id', controller.deleteAccount);

module.exports = router;