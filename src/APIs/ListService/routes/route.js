const express = require('express');
const controller = require('../controllers/controller');

const router = express.Router();

// TMF666‑style service retrieval under accountManagement
router.get('/tmf-api/accountManagement/v4/service', controller.getService);

module.exports = router;