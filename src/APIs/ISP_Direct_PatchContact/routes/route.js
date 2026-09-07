const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632 – PATCH to update ISP_Direct contact by telephone number
router.patch('/tmf-api/partyManagement/v4/individual/isp-direct/contact', controller.updateISPContact);

module.exports = router;