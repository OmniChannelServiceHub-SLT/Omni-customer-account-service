const express = require('express');
const controller = require('../controllers/updateUserInfo.controller');

const router = express.Router();

// CTK – TMF632 PATCH (NEW)
//router.patch('/tmf-api/partyManagement/v4/individual/:id', controller.updateIndividual);


// TMF632-compliant update – POST is kept, path uses resource ID
router.post('/tmf-api/partyManagement/v4/individual/:id', controller.updateIndividual);


module.exports = router;