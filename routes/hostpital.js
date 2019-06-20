var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const Multer = require('multer');
var mail = require('../Controller/Email');
var workspace = require('../Model/workspace');
const configration = require('../Controller/configration');
const fileConfigration = require('../Controller/fileConfigration');
let FieldValue = require('firebase-admin').firestore.FieldValue;
const db = admin.firestore();
const hospiatalCollection = db.collection('hospital');
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

// add hospital
router.post('/register',function (req,res,next) {
    var username =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    var address = req.body.address;
    var phone = req.body.phone;
    var email = req.body.email;
    var city = req.body.city;
    var capital = req.body.capital;
    let password = Math.random().toString(36).substring(7);
    //console.log(phone,address,email,city,capital);
    if (username != null && username != undefined && password != null && password != undefined && address != null && address != undefined && phone != null && phone != undefined && email != null && email != undefined&& city != null && city != undefined&& capital != null && capital != undefined) {
        configration.checkEmail('hospital',email).then(success=>{
            res.json({status: 404, message: 'this email is already exist'});
        }).catch(err=>{
            configration.checkUsername('hospital', username).then(sucess => {
                res.json({status: 404, message: 'this username is already token'});

            }).catch(err => {
                //send confirmation email
                mail.registrationMailPlace(email, username, password).then(cof => {
                    hospiatalCollection.add({
                        username: username,
                        password: password,
                        email: email,
                        address: address,
                        phone: phone,
                        city: city,
                        capital: capital
                    })
                    .then(ref => {
                        console.log('Added document with ID: ', ref.id);
                        workspace.insert({username:username}).then(success=>{
                            res.json({status: 200, message: 'email send please check your inbox'});
                        });
                    }).catch(err => {
                        res.json({status: 404, message: 'error in db connection'});
                    })
                    }).catch(err => {
                    //console.log('invalid email address', err);
                    res.json({status: 404, message: 'error in connection please try again'});
                });
            });
        })

    } else {
        res.json({status: 404, message: 'uncompleted params request'});
    }
})
router.post('/login',function (req,res,next) {
    const username = req.body.username;
    const password = req.body.password;
    if(username != null && password != undefined && username != null && password != undefined) {
        configration.checkUsername('hospital',username)
            .then(snapshot => {
                //console.log(snapshot);
                let Ref = hospiatalCollection.doc(snapshot);
                let transaction = db.runTransaction(t => {
                    return t.get(Ref)
                        .then(doc => {
                            if(password==doc.data().password) {
                                if(doc.data().tempPassword == undefined){
                                    return res.json({status: 200, message: 'lab found', userdata: doc.data()});
                                } else{
                                    // delete temp password
                                    // Remove the 'temp password' field from the document
                                    let removeCapital = Ref.update({
                                        tempPassword: FieldValue.delete()
                                    }).then(()=>{
                                        var hospital= {
                                            username:doc.data().username,
                                            password:password,
                                            adress:doc.data().address,
                                            phone:doc.data().phone,
                                            email: doc.data().email
                                        };
                                        res.json({status: 200, message: 'hospital found', userdata:hospital });
                                    }).catch(rej=>{
                                        return res.json({status: 404, message: 'temp password not deleted'});
                                    })

                                }
                            }else if(password==doc.data().tempPassword){
                                // set password to temp password and delete temp password
                                // Remove the 'capital' field from the document
                                let removeCapital = Ref.update({
                                    password:password,
                                    tempPassword: FieldValue.delete()
                                }).then(()=>{
                                    var hospital = {
                                        username:doc.data().username,
                                        password:password,
                                        adress:doc.data().address,
                                        phone:doc.data().phone,
                                        email: doc.data().email
                                    };
                                    return res.json({status: 200, message: 'hospital found', userdata: hospital});
                                }).catch(err=>{
                                    return res.json({status: 404, message: 'hospital not found'});
                                })

                            }else{
                                return res.json({status: 404, message: 'invalid password'});
                            }
                        })
                        .catch(err => {
                            console.log('Error getting documents', err);
                            return res.json({status: 404, message: 'Error in db connection'});
                        });
                });
            }).then(result => {
            console.log('Transaction success!');
        }).catch(err => {
            console.log('Transaction failure:', err);
            return res.json({status: 404, message: 'username does not exist'});
        });

    }else{
        return res.json({status: 404, message: 'missing data'});
    }
})
router.post('/delete',function (req,res,next){
    var username = req.body.username;
    configration.checkUsername('hospital',username).then(success=>{
        hospiatalCollection.doc(success).delete().then(()=>{
            res.json({status: 200, message: 'hospital delete successfully'});
        })
            .catch(err => {
                console.log('Error deleting documents', err);
                res.json({status:404,message:'Error : data connection'});
            });

    }).catch(err=>{
        res.json({status: 404, message: 'this hospital does not exist'});
    })

})
router.post('/addFile',multer.single('file'),function (req,res,next) {
    var username = req.body.username ;
    var file = req.file;
    var hospital = req.body.hospital;
    if(username != null && username != undefined && hospital != null && hospital != undefined) {
        configration.checkUsername('patient-account',username).then((success) => {
            if (file) {
                fileConfigration.uploadFileToStorage(file)
                    .then((success) => {
                        console.log('success', success)
                        filesLab.add({
                            file_name: success,
                            patient: username,
                            hospital: hospital
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
            }else{
                res.json({status: 404, message: 'missing file field'});
            }
        }).catch(err => {
            res.json({status: 404, message: 'patient not found'});
        });
    }else{
        res.json({status: 404, message: 'missing data'});
    }
});
router.post('/updatePassword',function (req,res,next){
    var username = req.body.username;
    //var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    if(username != undefined && username != null && password != undefined && password != null) {
        configration.checkUsername('hospital', username).then(success => {
            hospiatalCollection.doc(success).update(
                {password: password}
            ).then(() => {
                res.json({status: 200, message: 'hospital password updated successfully'});
            })
                .catch(err => {
                    console.log('Error updating documents', err);
                    res.json({status: 404, message: 'Error : element not found'});
                });

        }).catch(err => {
            res.json({status: 404, message: 'this hospital does not exist'});
        })
    }else{
        res.json({status: 404, message: 'missing data request'});
    }
})
router.post('/updatephone',function (req,res,next){
    var username = req.body.username;
    var phone = req.body.phone;
    if(username != undefined && username != null && phone != undefined && phone != null) {
        configration.checkUsername('hospital', username).then(success => {
            hospiatalCollection.doc(success).update(
                {phone: phone}
            ).then(() => {
                res.json({status: 200, message: 'hospital phone updated successfully'});
            })
                .catch(err => {
                    console.log('Error updating documents', err);
                    res.json({status: 404, message: 'Error : element not found'});
                });

        }).catch(err => {
            res.json({status: 404, message: 'this hospital does not exist'});
        })
    }else{
        res.json({status: 404, message: 'missing request data'});
    }
})
router.post('/forgetPassword',function (req,res,next) {
    let username = req.body.username;
    configration.checkUsername('hospital',username).then(success=> {
        configration.getEmail('hospital', success).then(email => {
            //console.log(success);
            let tempPassword = Math.random().toString(36).substring(7);
            mail.sendEmail(email, tempPassword).then(success => {
                // add temp password
                hospiatalCollection.doc(success).update({tempPassword: tempPassword}).then(() => {
                    res.json({status: 200, message: 'mail send please check your inbox'});
                }).catch(err => {
                    res.json({status: 404, message: 'failed in connection please try again'});
                })
            }).catch(err => {
                console.log(err);
                res.json({status: 404, message: 'error in mail sending process'});
            })
        }).catch(err => {
            res.json({status: 404, message: 'hospital email is not recognize please contact with us to solve these problem'});
        })
    }).catch(err=>{
        res.json({status: 404, message: 'this hospital does not exist'});
    })
})
//mising search patient function that take public paient id and get files and medecin related to this user

module.exports = router;