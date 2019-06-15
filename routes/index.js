var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const serviceAccountPath = "C://Users//go//Downloads//patient-history-c41dda1dd688.json";
var serviceAccount = require(serviceAccountPath);
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "patient-history-12cb8.appspot.com"
  //databaseURL: "https://patient-history-12cb8.firebaseio.com"
});
const db = admin.firestore();





/* GET home page. */
router.get('/', function(req, res, next) {
  let name ;
  let password;
  let doctors =[];
  db.collection('doctor-account').get().then((snapshot)=>{
    snapshot.docs.forEach(element => {
      name = element.data().username;
      password = element.data().password;
      doctors.push({username : name,password:password});
    });
    res.json({message:'successful get',doctors_accounts: doctors});
  });

});

module.exports = router;
