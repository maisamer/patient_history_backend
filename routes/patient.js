var express = require('express');
var router = express.Router();
var fs = require('fs');
var admin = require("firebase-admin");
const pdfjs = require('pdfjs-dist');
const fileConf = require('../Controller/fileConfigration');
const control = require('../Controller/patient');

const Multer = require('multer');

const db = admin.firestore();


var bucket = admin.storage().bucket();

const patientCollection = db.collection('patient-account');

const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});
router.get('/', function(req, res, next) {
    let name ;
    let password;
    let doctors =[];
    patientCollection.get().then((snapshot)=>{
        snapshot.docs.forEach(element => {
            name = element.data().username;
            password = element.data().password;
            doctors.push({username : name,password:password});
        });
        res.json({message:'successful patient account get',doctors_accounts: doctors});
    });

});
router.post('/updateprofilepicture',multer.single('file'),function (req,res,next) {
    //console.log(req.file);
    let file = req.file;
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    if(username != null && password != undefined && username != null && password != undefined) {
        if (file) {
            fileConf.uploadFileToStorage(file)
                .then((success) => {
                    console.log('success',success)
                    patientCollection.add({
                            imageURL : success,
                            username: username,
                            password: password
                        }).then(ref => {
                            console.log('Added document with ID: ', ref.id);
                            res.json({status: 200, message: 'patient added successfully'})
                        })
                            .catch(err => {
                                console.log('Error adding documents', err);
                                res.json({status: 404, message: 'error in connection database'});
                            });


                }).catch((error) => {
                console.error(error);
                res.json({status: 404, message: 'error in uploading image'});
            });
    }
}

});
router.post('/search',control.searchById);
router.post('/login',control.login);
router.post('/addpatientdata',control.addInf);
router.post('/register',control.register);
router.post('/permission',control.givePermission); //
router.post('/profilePicture',multer.single('file'),control.updateProfilePicture);

module.exports = router;