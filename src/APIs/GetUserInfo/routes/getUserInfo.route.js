const express = require('express');
const controller = require('../controllers/getUserInfo.controller');

const router = express.Router();

// CTK Target: Pure TMF632 Resource
router.get('/tmf-api/partyManagement/v4/Individual/:id', controller.getIndividual);

// Legacy Backward Compatibility: Flat Envelope
router.get('/api/Account/ViewUserInfo', controller.getViewUserInfoLegacy);

router.post('/tmf-api/partyManagement/v4/Individual', controller.createIndividual);

// TMF632: GET with query filters
router.get('/tmf-api/partyManagement/v4/Individual', controller.getIndividual);


module.exports = router;