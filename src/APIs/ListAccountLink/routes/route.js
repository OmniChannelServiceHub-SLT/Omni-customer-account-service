const express = require('express');
const router = express.Router();
const controller = require('../controllers/controller');

router.get('/api/PeoVAS/CheckOmniTP', controller.checkOmniTP);

module.exports = router;