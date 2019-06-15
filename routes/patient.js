var express = require('express');
var router = express.Router();
var fs = require('fs');
var admin = require("firebase-admin");
const pdfjs = require('pdfjs-dist');

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
async function downloadFile() {
    const {Storage} = require('@google-cloud/storage');
    var projectId = "patient-history-12cb8";
    var keyFilename ="C://Users//go//Downloads//patient-history-c41dda1dd688.json";
    const storage = new Storage({projectId, keyFilename});


    try {
        const bucket = storage.bucket('patient-history-12cb8.appspot.com');
        const file = bucket.file('ThinkBIG! Summer internships 2019.pdf');
        file.download(function(err, contents) {
            if(err){
                console.log(err);
            }else
            console.log('content ',contents);
            // image
            /*fs.writeFile('image.png', contents,function(err, result){
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                }
            });*/
            //pdf


        });

    } catch (err) {
        console.error('ERROR:', err);
    }
}
async function readPDF(buffer) {

    const pdf = await pdfjs.getDocument({data: buffer});
    console.log(pdf);
    // ...
}

router.post('/update',function (req,res,next) {
    downloadFile();
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
router.post('/login',function (req,res,next) {
    var username = req.body.username;
    var password = req.body.password;
    patientCollection.where('username', '==',username).where('password','==',password).get()
        .then(snapshot => {
            if (snapshot.empty) {
                console.log('No matching documents.');
                return res.json({status:404,message:'user not found'});
            }

            snapshot.forEach(doc => {
                console.log(doc.id, '=>', doc.data());
                // download image


                }).catch(function(error) {
                    // Handle any errors
                    console.log('error here',error);
                });
                return res.json({status:200,message:'user found',userdata:doc.data()});
            })
        .catch(err => {
            console.log('Error getting documents', err);
        });

});
router.post('/add',multer.single('file'),function (req,res,next) {
    //console.log(req.file);
    let file = req.file;
    let username = req.body.username;
    let password = req.body.password;
    console.log(username,password);
    if(username != null && password != undefined && username != null && password != undefined) {
        if (file) {
            uploadImageToStorage(file)
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
const uploadImageToStorage = (file) => {
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