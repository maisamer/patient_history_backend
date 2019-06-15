var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const Multer = require('multer');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

const db = admin.firestore();
const bucket = admin.storage().bucket();
const labCollection = db.collection('lab');
const filesLab = db.collection('filesLab');

router.post('/login',function (req,res,next) {
   var username = req.body.username;
   var password = req.body.password;
   if(username != null && password != undefined && username != null && password != undefined) {
       labCollection.where('username', '==', username).where('password', '==', password).get()
           .then(snapshot => {
               if (snapshot.empty) {
                   console.log('No matching documents.');
                   return res.json({status: 404, message: 'lab not found'});
               }

               snapshot.forEach(doc => {
                   console.log(doc.id, '=>', doc.data());
                   return res.json({status: 200, message: 'lab found', userdata: doc.data()});
               });
           })
           .catch(err => {
               console.log('Error getting documents', err);
               return res.json({status: 404, message: 'Error in db connection'});
           });
   }
});
router.post('/register',function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    if(username != null && password != undefined && username != null && password != undefined) {
        checkUsername('lab',username).then((success) => {
            res.json({status: 404, message: 'this username is already used'});
        }).catch(err=>{
            labCollection.add({
                username: username,
                password: password
            }).then(ref => {
                console.log('Added document with ID: ', ref.id);
                res.json({status: 200, message: 'lab added successfully'})
            })
                .catch(err => {
                    console.log('Error adding documents', err);
                    res.json({status: 404, message: 'error in connection database'});
                });
        });
    }else{
        res.json({status: 404, message: 'please enter correct data'});
    }
});
router.post('/addFile',multer.single('file'),function (req,res,next) {
    var username = req.body.username ;
    var file = req.file;
    var labId = req.body.labId;
    if(username != null && labId != undefined && username != null && labId != undefined) {
        checkUsername('patient-account',username).then((success) => {
            if (file) {
                uploadFileToStorage(file)
                    .then((success) => {
                        console.log('success', success)
                        filesLab.add({
                                file_name: success,
                                patient: username,
                                lab: labId
                            }).then(ref => {
                            console.log('Added document with ID: ', ref.id);
                            res.json({status: 200, message: 'File send successfully'})
                        })
                            .catch(err => {
                                console.log('Error adding documents', err);
                                res.json({status: 404, message: 'error in connection database'});
                            });


                    }).catch((error) => {
                    console.error(error);
                    res.json({status: 404, message: 'error in uploading the file'});
                });
            }
        }).catch(err => {
            res.json({status: 404, message: 'patient not found'});
        });
    }else{
        res.json({status: 404, message: 'missing data'});
    }
});
const checkUsername = (collection_name,username)=>{
    return new Promise((resolve, reject) => {
        db.collection(collection_name).where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    resolve(doc.id);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
}
const uploadFileToStorage = (file) => {
    return new Promise((resolve, reject) => {
        if (!file) {
            reject('No image file');
        }
        console.log(file);
        let newFileName = `${file.originalname}_${Date.now()}`;

        let fileUpload = bucket.file(newFileName);

        const blobStream = fileUpload.createWriteStream({
            metadata: {
                contentType: file.mimetype
            }
        });

        blobStream.on('error', (error) => {
            console.log(error);
            reject('Something is wrong! Unable to upload at the moment.');
        });

        blobStream.on('finish', () => {
            // The public URL can be used to directly access the file via HTTP.
            const url = fileUpload.name;

            resolve(url);
        });

        blobStream.end(file.buffer);
    });
}
module.exports = router;