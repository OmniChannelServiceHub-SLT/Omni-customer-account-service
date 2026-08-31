const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – Get profile distribution dashboard (returns all Individuals)
router.get('/tmf-api/partyManagement/v4/individual/dashboard', controller.getDashboard);

module.exports = router;