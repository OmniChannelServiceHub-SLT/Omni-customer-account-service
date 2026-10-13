const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/tmf-api/PeoVAS/CheckOmniTP', controller.checkOmniTP);

module.exports = router;