const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – Get ISP SOA profile by accountNo
router.get('/tmf-api/partyManagement/v4/individual/isp-soa', controller.getISPSOAProfile);

module.exports = router;