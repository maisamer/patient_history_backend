var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");
var email = require('../Controller/Email');
const configration = require('../Controller/configration');
let FieldValue = require('firebase-admin').firestore.FieldValue;

const db = admin.firestore();
const clinicColl = db.collection('clinic');
router.post('/register',function (req,res,next) {
    var username =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    var address = req.body.address;
    var phone = req.body.phone;
    var doctor = req.body.doctor;
    var city = req.body.city;
    var capital = req.body.capital;
    let password = Math.random().toString(36).substring(7);
    if (username != null && username != undefined && password != null && password != undefined && address != null && address != undefined && phone != null && phone != undefined && doctor != null && doctor != undefined&& city != null && city != undefined&& capital != null && capital != undefined) {

        configration.checkEmail('clinic', username).then(sucess => {
            res.json({status: 404, message: 'this email is already exist'});

        }).catch(err => {
            getAccount('doctor-account', doctor).then(sucess => {
                clinicColl.add({
                    username: username,
                    password: password,
                    doctor: doctor,
                    address: address,
                    phone: phone,
                    city:city,
                    capital:capital
                }).then(ref => {
                    //send mail
                     email.registrationMailPlace(sucess.email,username,password).then(cof=>{
                         console.log('Added document with ID: ', ref.id);
                         res.json({status: 200, message: 'email send please check your inbox'});
                     }).catch(err=>{
                         res.json({status: 404, message: 'error in sending mail process'});
                     })
                }).catch(err => {
                    console.log('Error adding documents', err);
                    res.json({status: 404, message: 'error in adding document'});
                });
            }).catch(err => {
                res.json({status: 404, message: 'doctor not found'});
            })
        });
    } else {
        res.json({status: 404, message: 'uncompleted params request'});
    }
})
router.post('/login',function (req,res,next) {
    const username = req.body.username;
    const password = req.body.password;
    if(username != null && password != undefined && username != null && password != undefined) {
        configration.checkUsername('clinic',username)
            .then(snapshot => {
                //console.log(snapshot);
                let Ref = clinicColl.doc(snapshot);
                let transaction = db.runTransaction(t => {
                    return t.get(Ref)
                        .then(doc => {
                            if(password==doc.data().password) {
                                if(doc.data().tempPassword == undefined){
                                    return res.json({status: 200, message: 'clinic found', userdata: doc.data()});
                                } else{
                                    // delete temp password
                                    // Remove the 'temp password' field from the document
                                    let removeCapital = Ref.update({
                                        tempPassword: FieldValue.delete()
                                    }).then(()=>{
                                        var clinic = {
                                            username:doc.data().username,
                                            password:password,
                                            adress:doc.data().address,
                                            phone:doc.data().phone,
                                            doctor: doc.data().doctor
                                        };
                                        res.json({status: 200, message: 'clinic found', userdata:clinic });
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
                                    var clinic = {
                                        username:doc.data().username,
                                        password:password,
                                        adress:doc.data().address,
                                        phone:doc.data().phone,
                                        doctor: doc.data().doctor
                                    };
                                    return res.json({status: 200, message: 'clinic found', userdata: clinic});
                                }).catch(err=>{
                                    return res.json({status: 404, message: 'clinic not found'});
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
                }).catch(result => {
                    return res.json({status: 404, message: 'username does not exist'});
                })

    }else{
        return res.json({status: 404, message: 'missing data'});
    }
})
router.post('/delete',function (req,res,next){
    var username = req.body.username;
    configration.checkUsername('clinic',username).then(success=>{
        clinicColl.doc(success).delete().then(()=>{
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
router.post('/updatePassword',function (req,res,next){
    var username = req.body.username;
    //var oldPassword = req.body.oldPassword;
    var password = req.body.password;
    if(username != undefined && username != null && password != undefined && password != null) {
        checkUsername('clinic', username).then(success => {
            clinicColl.doc(success).update(
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
        checkUsername('clinic', username).then(success => {
            clinicColl.doc(success).update(
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
    getDoctor(username).then(success=>{
        getEmail(success).then(success=>{
            //console.log(success);
            let tempPassword = Math.random().toString(36).substring(7);
            email.sendEmail(success,tempPassword).then(success=>{
                // add temp password
                checkUsername('clinic',username).then(success=>{
                    clinicColl.doc(success).update({tempPassword:tempPassword}).then(()=>{
                        res.json({status: 200, message: 'mail send please check your inbox'});
                    }).catch(err=>{
                        res.json({status: 404, message: 'failed in connection please try again'});
                    })
                }).catch(err=>{
                    res.json({status: 404, message: 'invalid username'});
                })

            }).catch(err=>{
                console.log(err);
                res.json({status: 404, message: 'error in mail sending process'});
            })
        }).catch(err=>{
            res.json({status: 404, message: 'doctor mail undefined'});
        })
    })
        .catch(err=>{
            res.json({status: 404, message: 'this clinic does not exist'});
        })
})
router.post('/allClinic',function (req,res,next) {
    clinicColl.get().then(docs=>{
        let clinics = [];
        if (docs.empty) {
            console.log('No matching document.');
            res.json({status: 404, message: 'no clinic here'});
        }
        else {
            docs.forEach(doc => {
                //console.log(doc.id, '=>', doc.data());
                clinics.push(doc.data());
            })
            return res.json({status: 200, message: 'success transaction', clinics: clinics});
        }
        }).catch(err => {
            console.log('Error getting documents', err);
            res.json({status: 404, message: 'Error getting documents'});
        });

})
router.post('/allClinic/doctor',function (req,res,next) {
    var username = req.body.username;
    if(username != undefined && username != null) {
        clinicColl.where('doctor', '==', username).get().then(docs => {
            let clinics = [];
            if (docs.empty) {
                console.log('No matching document.');
                res.json({status: 404, message: 'no clinic here'});
            }
            else {
                docs.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    clinics.push(doc.data());
                })
                return res.json({status: 200, message: 'success transaction', clinics: clinics});
            }
        }).catch(err => {
            console.log('Error getting documents', err);
            res.json({status: 404, message: 'Error getting documents'});
        });
    }else{
        res.json({status: 404, message: 'missing request data'});
    }

})
router.post('/allClinic/city',function (req,res,next) {
    var city = req.body.city;
    if(city != undefined && city != null) {
        clinicColl.where('city', '==', city).get().then(docs => {
            let clinics = [];
            if (docs.empty) {
                console.log('No matching document.');
                res.json({status: 404, message: 'no clinic here'});
            }
            else {
                docs.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    clinics.push(doc.data());
                })
                res.json({status: 200, message: 'success transaction', clinics: clinics});
            }

        }).catch(err => {
            console.log('Error getting documents', err);
            res.json({status: 404, message: 'Error getting documents'});
        });
    }else{
        res.json({status: 404, message: 'missing data request'});
    }

})
router.post('/allClinic/capital',function (req,res,next) {
    var capital = req.body.capital;
    if(capital != undefined && capital!= null) {
        clinicColl.get().where('capital', '==', capital).then(docs => {
            let clinics = [];
            if (docs.empty) {
                console.log('No matching document.');
                res.json({status: 404, message: 'no clinic here'});
            }
            else {
                docs.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    clinics.push(doc.data());
                })
                return res.json({status: 200, message: 'success transaction', clinics: clinics});
            }
        }).catch(err => {
            console.log('Error getting documents', err);
            res.json({status: 404, message: 'Error getting documents'});
        });
    }else {
        res.json({status: 404, message: 'Error getting documents'});
    }

})

const getDoctor = (username)=>{
    return new Promise((resolve, reject) => {
        db.collection('clinic').where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    //console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    //console.log('doctor username',doc.data().doctor);
                    resolve(doc.data().doctor);
                });
            })
            .catch(err => {
                //console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
}
const getAccount = (collection,username)=>{
    return new Promise((resolve, reject) => {
        db.collection(collection).where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    //console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    //console.log('doctor username',doc.data().doctor);
                    resolve(doc.data());
                });
            })
            .catch(err => {
                //console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
}
const getEmail = (username)=>{
    return new Promise((resolve, reject) => {
        db.collection('doctor-account').where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    //console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    resolve(doc.data().email);
                });
            })
            .catch(err => {
                //console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
}

module.exports = router;