const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// CSV A161 path — uses DELETE method.
// TelephoneNo arrives as a query param (legacy shape), not path param.
router.delete(
  '/tmf-api/LTEPrepaid/deleteAccountLink',
  controller.removeAccountRequestLTE
);

module.exports = router;