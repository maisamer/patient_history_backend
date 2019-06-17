var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var mail = require('../Controller/Email');
const configration = require('../Controller/configration');
const patient = require('../Controller/patient');
const medicine = require('../Controller/medicine')
let FieldValue = require('firebase-admin').firestore.FieldValue;
const db = admin.firestore();
const pharmacyCollection = db.collection('pharmacy');

// add pharmacy
router.post('/register',function (req,res,next) {
    var username =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    var address = req.body.address;
    var phone = req.body.phone;
    var email = req.body.email;
    var city = req.body.city;
    var capital = req.body.capital;
    var countCorrectConfirmation = 0;
    let password = Math.random().toString(36).substring(7);
    //console.log(phone,address,email,city,capital);
    if (username != null && username != undefined && password != null && password != undefined && address != null && address != undefined && phone != null && phone != undefined && email != null && email != undefined&& city != null && city != undefined&& capital != null && capital != undefined) {
        configration.checkEmail('pharmacy',email).then(success=>{
            res.json({status: 404, message: 'this email is already exist'});
        }).catch(err=>{
            configration.checkUsername('pharmacy', username).then(sucess => {
                res.json({status: 404, message: 'this username is already token'});

            }).catch(err => {
                //send confirmation email
                mail.registrationMailPlace(email, username, password).then(cof => {
                    pharmacyCollection.add({
                        username: username,
                        password: password,
                        email: email,
                        address: address,
                        phone: phone,
                        city: city,
                        capital: capital,
                        countCorrectConfirmation:countCorrectConfirmation
                    })
                        .then(ref => {
                            console.log('Added document with ID: ', ref.id);
                            res.json({status: 200, message: 'email send please check your inbox'});
                        }).catch(err => {
                        res.json({status: 404, message: 'error in db connection'});
                    })
                }).catch(err => {
                    console.log('invalid email address', err);
                });
            });
        })

    } else {
        res.json({status: 404, message: 'uncompleted params request'});
    }
})
// login to pharmacy account
router.post('/login',function (req,res,next) {
    const username = req.body.username;
    const password = req.body.password;
    if(username != null && password != undefined && username != null && password != undefined) {
        configration.checkUsername('pharmacy',username)
            .then(snapshot => {
                //console.log(snapshot);
                let Ref = pharmacyCollection.doc(snapshot);
                let transaction = db.runTransaction(t => {
                    return t.get(Ref)
                        .then(doc => {
                            if(password==doc.data().password) {
                                if(doc.data().tempPassword == undefined){
                                    return res.json({status: 200, message: 'pharmacy found', userdata: doc.data()});
                                } else{
                                    // delete temp password
                                    // Remove the 'temp password' field from the document
                                    let removeCapital = Ref.update({
                                        tempPassword: FieldValue.delete()
                                    }).then(()=>{
                                        var pharmacy= {
                                            username:doc.data().username,
                                            password:password,
                                            adress:doc.data().address,
                                            phone:doc.data().phone,
                                            email: doc.data().email
                                        };
                                        res.json({status: 200, message: 'lab found', userdata:pharmacy });
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
                                    var pharmacy = {
                                        username:doc.data().username,
                                        password:password,
                                        adress:doc.data().address,
                                        phone:doc.data().phone,
                                        email: doc.data().email
                                    };
                                    return res.json({status: 200, message: 'pharmacy found', userdata: pharmacy});
                                }).catch(err=>{
                                    return res.json({status: 404, message: 'pharmacy not found'});
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
//
// delete pharmacy
router.post('/delete',function (req,res,next){
    var username = req.body.username;
    configration.checkUsername('pharmacy',username).then(success=>{
        pharmacyCollection.doc(success).delete().then(()=>{
            res.json({status: 200, message: 'pharmacy delete successfully'});
        })
            .catch(err => {
                console.log('Error deleting documents', err);
                res.json({status:404,message:'Error : data connection'});
            });

    }).catch(err=>{
        res.json({status: 404, message: 'this pharmacy does not exist'});
    })

})
// update password
router.post('/updatePassword',function (req,res,next){
    var username = req.body.username;
    //var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    if(username != undefined && username != null && password != undefined && password != null) {
        configration.checkUsername('pharmacy', username).then(success => {
            pharmacyCollection.doc(success).update(
                {password: password}
            ).then(() => {
                res.json({status: 200, message: 'pharmacy password updated successfully'});
            })
                .catch(err => {
                    console.log('Error updating documents', err);
                    res.json({status: 404, message: 'Error : element not found'});
                });

        }).catch(err => {
            res.json({status: 404, message: 'this pharmacy does not exist'});
        })
    }else{
        res.json({status: 404, message: 'missing data request'});
    }
})
//update phone number
router.post('/updatephone',function (req,res,next){
    var username = req.body.username;
    var phone = req.body.phone;
    if(username != undefined && username != null && phone != undefined && phone != null) {
        configration.checkUsername('pharmacy', username).then(success => {
            pharmacyCollection.doc(success).update(
                {phone: phone}
            ).then(() => {
                res.json({status: 200, message: 'pharmacy phone updated successfully'});
            })
                .catch(err => {
                    console.log('Error updating documents', err);
                    res.json({status: 404, message: 'Error : element not found'});
                });

        }).catch(err => {
            res.json({status: 404, message: 'this pharmacy does not exist'});
        })
    }else{
        res.json({status: 404, message: 'missing request data'});
    }
})
//forget password
router.post('/forgetPassword',function (req,res,next) {
    let username = req.body.username;
    configration.checkUsername('pharmacy',username).then(success=> {
        configration.getEmail('pharmacy', success).then(email => {
            //console.log(success);
            let tempPassword = Math.random().toString(36).substring(7);
            mail.sendEmail(email, tempPassword).then(success => {
                // add temp password
                pharmacyCollection.doc(success).update({tempPassword: tempPassword}).then(() => {
                    res.json({status: 200, message: 'mail send please check your inbox'});
                }).catch(err => {
                    res.json({status: 404, message: 'failed in connection please try again'});
                })
            }).catch(err => {
                console.log(err);
                res.json({status: 404, message: 'error in mail sending process'});
            })
        }).catch(err => {
            res.json({status: 404, message: 'pharmacy email is not recognize please contact with us to solve these problem'});
        })
    }).catch(err=>{
        res.json({status: 404, message: 'this hospital does not exist'});
    })
})
// get all users in system
router.post('/allpatient',function (req,res,next) {
    patient.getallusers().then(success=>{
        res.json({status:200,patients:success});
    }).catch(err=>{
        res.json({status:404,message:'there is no patient'});
    })

})
// get medicine related to user
router.post('/showmedicine',function (req,res,next) {
    let id = req.body.id;
    if(id != null && id != undefined) {
        medicine.getMedicine(id)
            .then(success => {
                res.json({status:200,medicine:success});
            })
            .catch(err => {
                res.json({status:404,message:'missing user id'});
            })
    }else{
        res.json({status:404,message:'missing user id'});
    }

})

module.exports = router;