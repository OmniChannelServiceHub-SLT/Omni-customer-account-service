const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – Get PEO profile by subscriber ID or accountNo
router.get('/tmf-api/partyManagement/v4/individual/peo-profile', controller.getPEOProfile);

module.exports = router;