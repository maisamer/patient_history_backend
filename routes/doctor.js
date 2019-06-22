var express = require('express');
var router = express.Router();
var controller = require('../Controller/doctor');

router.post('/add',controller.add);
router.post('/delete',controller.delete);
router.post('/login',controller.login);
router.post('/rate',controller.rate);
router.post('/get',controller.get); //search by id
router.post('/patients',controller.getAllPatient); // get all patient username that give permission to doctor
module.exports = router;