var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('filesLab');

router.post('/',function (req,res,next) {

    let username = req.body.username;
    console.log(username);
    if(username !=null && username != undefined) {
        collection.where('patient', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    res.json({status: 404});
                }
                var file = [];
                snapshot.forEach(doc => {
                    console.log(doc.id);
                    file.push({link: doc.data().file_name});
                });
                res.json({status: 200, file: file});
            })
            .catch(err => {
                console.log('Error getting documents', err);
                res.json({status: 404});
            });
    }else{
        console.log('missing data');
        res.json({status: 404});
    }
});
module.exports = router;