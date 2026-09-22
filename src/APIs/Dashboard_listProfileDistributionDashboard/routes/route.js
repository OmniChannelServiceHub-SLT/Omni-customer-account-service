const express = require('express');
const controller = require('../controllers/controller');
const resolveClientType = require('../../../common/middleware/resolveClientType');
const router = express.Router();

// TMF632 – Get profile distribution dashboard (returns all Individuals)
router.get('/tmf-api/partyManagement/v4/individual/dashboard', resolveClientType, controller.getDashboard);

module.exports = router;