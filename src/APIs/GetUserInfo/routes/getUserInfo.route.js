const express = require('express');
const controller = require('../controllers/getUserInfo.controller');

const router = express.Router();

// CTK Target: Pure TMF632 Resource
router.get('/tmf-api/partyManagement/v4/individual/:id', controller.getIndividual);

// Legacy Backward Compatibility: Flat Envelope
router.get('/api/Account/ViewUserInfo', controller.getViewUserInfoLegacy);

router.post('/tmf-api/partyManagement/v4/individual', controller.createIndividual);

module.exports = router;