var express = require('express');
var router = express.Router();
var controller = require('../Controller/medicine');

router.post('/add',controller.add);
router.post('/update',controller.update);
router.post('/',controller.getMedicineDisease);

module.exports = router;