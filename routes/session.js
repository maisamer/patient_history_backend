var express = require('express');
var router = express.Router();
var sessionController = require('../Controller/session');

router.post('/add',sessionController.addSession);
router.post('/update',sessionController.updateSession);
module.exports = router;