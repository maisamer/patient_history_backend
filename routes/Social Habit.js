var express = require('express');
var router = express.Router();
var socialHabitController = require('../Controller/Social Habit');

router.post('/add',socialHabitController.addSocial_habit);
router.post('/update',socialHabitController.updateSocial_habit);
router.post('/delete',socialHabitController.deleteSocial_habit);
router.post('/get',socialHabitController.getSocial_habit);
router.post('/',socialHabitController.get);
module.exports = router;