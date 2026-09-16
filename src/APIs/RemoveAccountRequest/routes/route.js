const express = require('express');
const controller = require('../controllers/controller');
const resolveClientType = require('../../../common/middleware/resolveClientType');

const router = express.Router();

// TMF666-compliant account removal (POST kept, but TMF path)
//router.post('/tmf-api/accountManagement/v4/billingAccount/:id/terminate', controller.deleteAccount);
router.delete('/tmf-api/accountManagement/v4/billingAccount/:id',resolveClientType, controller.removeAccount);
// Legacy dialect — POST, accountNo in query per CSV A16
router.post(
  '/api/AccountOMNI/RemoveAccountRequest',
  resolveClientType,
  controller.removeAccount
);
module.exports = router;