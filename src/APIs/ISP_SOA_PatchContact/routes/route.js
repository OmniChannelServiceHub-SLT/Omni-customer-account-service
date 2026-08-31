const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – PATCH to update ISP SOA contact by accountNo
router.patch('/tmf-api/partyManagement/v4/individual/isp-soa/contact', controller.updateISPSOAContact);

module.exports = router;