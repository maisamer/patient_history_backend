var express = require('express');
var router = express.Router();
var controller = require('../Controller/doctor');

router.post('/add',controller.add);
router.post('/delete',controller.delete);
router.post('/login',controller.login);
router.post('/rate',controller.rate);

module.exports = router;