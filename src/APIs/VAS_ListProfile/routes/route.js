const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – Get VAS profile by subscriberID
router.get('/tmf-api/partyManagement/v4/Individual/vas', controller.getVASProfile);

module.exports = router;