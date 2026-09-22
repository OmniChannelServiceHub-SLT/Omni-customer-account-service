const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – Get ISP Direct profile by telephone number (tpNo)
router.get('/tmf-api/partyManagement/v4/individual/isp-direct', controller.getISPDirectProfile);

module.exports = router;