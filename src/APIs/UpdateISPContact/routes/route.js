const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632-compliant PUT – ISP contact update (separate path)
router.put('/tmf-api/partyManagement/v4/individual/:id/ispcontact', controller.updateISPContact);

module.exports = router;