const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

// CSV A161 path
router.post(
  '/tmf-api/LTEPrepaid/deleteAccountLink',
  controller.removeAccountRequestLTE
);

module.exports = router;