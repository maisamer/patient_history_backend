var express = require('express');
var router = express.Router();
var controller = require('../Controller/ads');
const Multer = require('multer');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 1 * 1024 * 1024 // no larger than 1mb, you can change as needed.
    }
});
router.post('/addFile',multer.single('file'),function (req,res,next) {
    var username = req.body.username ;
    var file = req.file;
    var text = req.body.text;
    if(username != null && username != undefined && lab != null && lab != undefined) {
        configration.checkUsername('patient-account',username).then((success) => {
            if (file) {
                fileConfigration.uploadFileToStorage(file)
                    .then((success) => {
                        console.log('success', success)
                        filesLab.add({
                            file_name: success,
                            patient: username,
                            lab: lab
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

module.exports = router;