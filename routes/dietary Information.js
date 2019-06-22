var express = require('express');
var router = express.Router();
var controller = require('../Controller/dietary Information');

router.post('/add',controller.add);
router.post('/update',controller.update);
router.post('/delete',controller.delete);
router.post('/get',controller.getDietaryInformation);
router.post('/',controller.get);
module.exports = router;