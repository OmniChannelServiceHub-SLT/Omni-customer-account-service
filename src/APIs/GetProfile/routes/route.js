const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632-compliant GET profile by subscriberID
router.get('/tmf-api/partyManagement/v4/individual', controller.getProfile);

module.exports = router;