const express = require('express');
const controller = require('../controllers/controller');
const resolveClientType = require('../../../common/middleware/resolveClientType');

const router = express.Router();

// TMF-style VAS account creation (POST kept, path under accountManagement)
router.post('/tmf-api/accountManagement/v4/vasAccount', resolveClientType,controller.createVasAccount);

router.post(
  '/api/AccountOMNI/VASAccountRequest',
  resolveClientType,
  controller.createVasAccount
);
module.exports = router;