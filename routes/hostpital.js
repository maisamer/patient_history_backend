var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");


const db = admin.firestore();
const adminColl = db.collection('hospital');

// add hospital
router.post('/add',function (req,res,next) {
    let username = req.body.username;
    let password = req.body.password;
    if(username != null && password != undefined && username != null && password != undefined){
        clinicColl.add({
            username : username,
            password : password
        }).then(ref => {
            console.log('Added document with ID: ', ref.id);
            res.json({status : 200,message:'clinic added successfully'})
        })
            .catch(err => {
                console.log('Error adding documents', err);
                res.json({status:404,message:'error in connection database'});
            });

    }else{
        res.json({status : 404,message:'request params is undefined'})
    }

});
module.exports = router;