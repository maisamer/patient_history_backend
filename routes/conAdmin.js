var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");


const db = admin.firestore();
const adminColl = db.collection('admin');
// log in
router.post('/login', function(req, res, next) {
    let username = req.body.username ;
    let password = req.body.password;
    adminColl.where('username', '==',username).where('password','==',password).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return res.json({status:404,message:'user not found'});
            }
            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                return res.json({status:200,message:'user found',userdata:doc.data()});
            });
        })
        .catch(err => {
            console.log('Error getting documents', err);
        });
});

module.exports = router;