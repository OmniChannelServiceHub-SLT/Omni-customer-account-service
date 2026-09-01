const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF632-compliant PUT update contact
router.put('/tmf-api/partyManagement/v4/individual/:id', controller.updateContact);

module.exports = router;