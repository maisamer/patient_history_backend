var express = require('express');
var router = express.Router();
var physicalExamContoller = require('../Controller/Physical_Exam');

router.post('/add',physicalExamContoller.addPhysicalExam);
router.post('/update',physicalExamContoller.addPhysicalExam);
router.post('/delete',physicalExamContoller.deletePhysicalExam);
module.exports = router;