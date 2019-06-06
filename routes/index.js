var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");

var serviceAccount = require("../patient-history-12cb8-firebase-adminsdk-51qrh-5cdf54664b.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
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
