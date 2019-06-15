var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const db = admin.firestore();
const appointmentColl = db.collection('appointment');

router.post('/add',function (req,res,next) {
    
});
router.post('/update',function (req,res,next) {

});
router.post('/delete',function (req,res,next) {

});
router.get('/',function (req,res,next) {
    
})

module.exports = router;