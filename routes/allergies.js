var express = require('express');
var router = express.Router();
var controller = require('../Controller/allergies');

router.post('/add',controller.addAllergies);
router.post('/update',controller.updateAllergies);
router.post('/delete',controller.deleteAllergies);
router.post('/get',controller.getAllergies);
router.post('/',controller.get);
module.exports = router;