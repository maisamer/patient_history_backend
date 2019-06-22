var express = require('express');
var router = express.Router();
var physicalExamContoller = require('../Controller/Physical_Exam');

router.post('/add',physicalExamContoller.addPhysicalExam);
router.post('/update',physicalExamContoller.addPhysicalExam);
router.post('/delete',physicalExamContoller.deletePhysicalExam);
router.post('/get',physicalExamContoller.getPhysicalExam);
router.post('/',physicalExamContoller.get);
module.exports = router;