const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// CSV A160 path
router.post(
  '/tmf-api/LTEPrepaid/createAccountLink',
  controller.addAccountRequestLTE
);

module.exports = router;