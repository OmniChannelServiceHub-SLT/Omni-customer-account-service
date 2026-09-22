const express = require('express');
const controller = require('../controllers/getUserInfo.controller');
const resolveClientType = require('../../../common/middleware/resolveClientType');
const router = express.Router();

// CTK Target: Pure TMF632 Resource
router.get('/tmf-api/partyManagement/v4/Individual/:id', controller.getIndividual);

// Legacy Backward Compatibility: Flat Envelope
router.get('/api/Account/ViewUserInfo', resolveClientType,controller.getIndividual);

router.post('/tmf-api/partyManagement/v4/Individual',resolveClientType, controller.createIndividual);

// TMF632: GET with query filters
router.get('/tmf-api/partyManagement/v4/Individual',resolveClientType, controller.getIndividual);


module.exports = router;