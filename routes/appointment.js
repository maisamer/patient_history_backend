var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const db = admin.firestore();
const appointmentColl = db.collection('appointment');


module.exports = router;