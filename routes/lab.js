var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
const Multer = require('multer');
const configration = require('../Controller/configration');
const fileConfigration = require('../Controller/fileConfigration');
var mail = require('../Controller/Email');
let FieldValue = require('firebase-admin').firestore.FieldValue;
const multer = Multer({
    storage: Multer.memoryStorage(),
    limits: {
        fileSize: 5 * 1024 * 1024 // no larger than 5mb, you can change as needed.
    }
});

const db = admin.firestore();
const labCollection = db.collection('lab');
const filesLab = db.collection('filesLab');
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
        configration.checkEmail('lab',email).then(success=>{
            res.json({status: 404, message: 'this email is already exist'});
        }).catch(err=>{
            configration.checkUsername('lab', username).then(sucess => {
                res.json({status: 404, message: 'this username is already token'});

            }).catch(err => {
                labCollection.add({
                    username: username,
                    password: password,
                    email: email,
                    address: address,
                    phone: phone,
                    city: city,
                    capital: capital
                })
                    .then(ref => {
                        //send email
                        mail.registrationMailPlace(email, username, password).then(cof => {
                            console.log('Added document with ID: ', ref.id);
                            res.json({status: 200, message: 'email send please check your inbox'});
                        }).catch(err => {
                            res.json({status: 404, message: 'error in sending email process'});
                        })
                    }).catch(err => {
                    console.log('Error adding documents', err);
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
        configration.checkUsername('lab',username)
            .then(snapshot => {
                //console.log(snapshot);
                let Ref = labCollection.doc(snapshot);
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
                                        var lab = {
                                            username:doc.data().username,
                                            password:password,
                                            adress:doc.data().address,
                                            phone:doc.data().phone,
                                            email: doc.data().email
                                        };
                                        res.json({status: 200, message: 'lab found', userdata:lab });
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
                                    var lab = {
                                        username:doc.data().username,
                                        password:password,
                                        adress:doc.data().address,
                                        phone:doc.data().phone,
                                        email: doc.data().email
                                    };
                                    return res.json({status: 200, message: 'lab found', userdata: lab});
                                }).catch(err=>{
                                    return res.json({status: 404, message: 'lab not found'});
                                })

                            }else{
                                return res.json({status: 404, message: 'unValid password'});
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
    configration.checkUsername('lab',username).then(success=>{
        labCollection.doc(success).delete().then(()=>{
            res.json({status: 200, message: 'clinic delete successfully'});
        })
            .catch(err => {
                console.log('Error deleting documents', err);
                res.json({status:404,message:'Error : data connection'});
            });

    }).catch(err=>{
        res.json({status: 404, message: 'this clinic does not exist'});
    })

})

router.post('/addFile',multer.single('file'),function (req,res,next) {
    var username = req.body.username ;
    var file = req.file;
    var lab = req.body.lab;
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
router.post('/updatePassword',function (req,res,next){
    var username = req.body.username;
    //var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    if(username != undefined && username != null && password != undefined && password != null) {
        configration.checkUsername('lab', username).then(success => {
            labCollection.doc(success).update(
                {password: password}
            ).then(() => {
                res.json({status: 200, message: 'clinic password updated successfully'});
            })
                .catch(err => {
                    console.log('Error updating documents', err);
                    res.json({status: 404, message: 'Error : element not found'});
                });

        }).catch(err => {
            res.json({status: 404, message: 'this clinic does not exist'});
        })
    }else{
        res.json({status: 404, message: 'missing data request'});
    }
})
router.post('/updatephone',function (req,res,next){
    var username = req.body.username;
    var phone = req.body.phone;
    if(username != undefined && username != null && phone != undefined && phone != null) {
        configration.checkUsername('clinic', username).then(success => {
            labCollection.doc(success).update(
                {phone: phone}
            ).then(() => {
                res.json({status: 200, message: 'clinic phone updated successfully'});
            })
                .catch(err => {
                    console.log('Error updating documents', err);
                    res.json({status: 404, message: 'Error : element not found'});
                });

        }).catch(err => {
            res.json({status: 404, message: 'this clinic does not exist'});
        })
    }else{
        res.json({status: 404, message: 'missing request data'});
    }
})
router.post('/forgetPassword',function (req,res,next) {
    let username = req.body.username;
    configration.checkUsername('lab',username).then(id=> {
        configration.getEmail('lab', success).then(email => {
            //console.log(success);
            let tempPassword = Math.random().toString(36).substring(7);
            mail.sendEmail(email, tempPassword).then(success => {
                // add temp password
                labCollection.doc(id).update({tempPassword: tempPassword}).then(() => {
                    res.json({status: 200, message: 'mail send please check your inbox'});
                }).catch(err => {
                    res.json({status: 404, message: 'failed in connection please try again'});
                })
            }).catch(err => {
                console.log(err);
                res.json({status: 404, message: 'error in mail sending process'});
            })
        }).catch(err => {
            res.json({status: 404, message: 'lab email is not recognize please contact with us to solve these problem'});
        })
    }).catch(err=>{
        res.json({status: 404, message: 'this clinic does not exist'});
    })
})

module.exports = router;