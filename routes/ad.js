var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const db = admin.firestore();
const adCollection = db.collection('ad');


module.exports = router;