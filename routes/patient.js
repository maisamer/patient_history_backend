var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");


const db = admin.firestore();
router.get('/', function(req, res, next) {
    let name ;
    let password;
    let doctors =[];
    db.collection('patient-account').get().then((snapshot)=>{
        snapshot.docs.forEach(element => {
            name = element.data().username;
            password = element.data().password;
            doctors.push({username : name,password:password});
        });
        res.json({message:'successful patient account get',doctors_accounts: doctors});
    });

});

module.exports = router;