const admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('patient-account');
const conf = require('../Controller/configration');
const model = require('../Model/disease');
const files = require('../Model/files');
const mail = require('../Controller/Email');
const pharmacy = require('../Model/pharmacy');
let FieldValue = require('firebase-admin').firestore.FieldValue;

// register
exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// log in
exports.get=(username,password)=>{
    return new Promise((resolve, reject) => {
        conf.checkUsername('patient-account',username).then(id=>{
            let Ref = collection.doc(id);
            let transaction = db.runTransaction(t => {
                return t.get(Ref)
                    .then(doc => {
                        if(password==doc.data().password) {
                            if(doc.data().tempPassword == undefined){
                                resolve({user:doc.data()});
                            } else{
                                // delete temp password
                                // Remove the 'temp password' field from the document
                                let removeCapital = Ref.update({
                                    tempPassword: FieldValue.delete()
                                }).then(()=>{
                                    resolve({id:doc.id,user:doc.data()});
                                }).catch(rej=>{
                                    reject({status: 404, message: 'temp password not deleted'});
                                })

                            }
                        }else if(password==doc.data().tempPassword){
                            // set password to temp password and delete temp password
                            let removeCapital = Ref.update({
                                password:password,
                                tempPassword: FieldValue.delete()
                            }).then(()=>{
                                resolve({id:doc.id, user: doc.data()});
                            }).catch(err=>{
                                console.log('error in update password process');
                                resolve({status: 404, message: 'error in update password process'});
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
        }).catch(err=>{
            reject('invalid username');
        })

    });
};
// delete account
exports.delete=(username)=>{
    return new Promise((resolve, reject) => {
        conf.checkUsername(username).then(id=>{
            collection.doc(id).delete().then(()=>{
                resolve('item deleted successfully');
            }).catch(err=>{
                reject('error in db connection');
            })
        }).catch(err=>{
            reject('username not found')
        })

    });
};
// hospital search by id
// name , nationalId , phone number , age , blood , disease
exports.getPatientById=(id)=>{
    return new Promise((resolve, reject) => {
        getById(id).then(sucess=>{
            console.log('username ',sucess.data.username);
            model.get(sucess.data.username).then(disease=>{
                console.log(sucess.data.blood);
                resolve({name:sucess.data.name,nationalId:sucess.data.nationalId,phone:sucess.data.phone,age:sucess.data.age,disease:disease,blood:sucess.data.blood});
            }).catch(err=>{
                console.log(err);
                reject(err);
            })
        }).catch(err=>{
            console.log(err);
            reject(err);
        })

    });
};
getById = (id)=>{
    return new Promise((resolve, reject) => {
        collection.where('globalId', '==', id).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve({id:doc.data().id,data:doc.data()});
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};

exports.getRandomUser =()=>{
    return new Promise((resolve, reject) => {
        collection.where('number_of_medicine', '>', 2).where('comment','==','no').get().then(docs => {
            if (docs.empty) {
                //console.log('No matching document.');
                reject('no patient');
            }
            else {
                docs.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    resolve({id:doc.data().globalId,username:doc.data().username});
                });
            }

        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting document');
        });
    });
};
exports.comment=(id)=>{
    return new Promise((resolve, reject) => {
        collection.where('globalId', '==', id).get().then(docs => {
            if (docs.empty) {
                console.log('No matching document.');
                reject('no patient');
            }
            else {
                docs.forEach(doc => {
                    // update comment to yes
                    collection.doc(doc.id).update({comment:'yes'}).then(()=>{
                        resolve('item updated successfully');
                    }).catch(err=>{
                        reject('error in db connection');
                    })
                });
            }

        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting document');
        });
    });
};
//update profile picture
exports.updateProfilePicture=(filename,id,oldFile)=>{
    // delete old file
    collection.doc(id).update({url:filename});
};
exports.addinfo=(username,item)=>{
    return new Promise((resolve, reject) => {
       // console.log('here',username);
        conf.checkUsername('patient-account',username).then(id => {
            collection.doc(id).update(item).then(() => {
                console.log('item updated successfully');
                resolve('item updated successfully');
            }).catch(err => {
                console.log('error in updating item');
                reject('error in updating item');
            })
        }).catch(err => {
            console.log('username does not exist');
            reject('username does not exist');
        })
    });
};
getMedicineCount = (username)=>{
    return new Promise((resolve, reject) => {
        collection.where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve({id:doc.id,med:doc.data().number_of_medicine});
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};

exports.addMedicine = (diseaseId)=>{
  //get username that have these id
  model.getUsername(diseaseId).then(username=>{
      getMedicineCount(username).then(item=>{
          console.log('number of medicine for ',username,' ',item.med);
          collection.doc(item.id).update({comment:'no',number_of_medicine:item.med+1});
      })
  })
};
exports.sendEmail=(id,userId,comment)=>{

    return new Promise((resolve, reject) => {
        pharmacy.getPharmacyName(id).then(pharmacyName=>{
            getEmailByGlobalId(userId).then(email => {
                mail.commentPharmacy(email, pharmacyName, comment).then(success => {
                    console.log('in mail sending process ', email, pharmacyName, comment);
                    resolve(success);
                }).catch(err => {
                    reject(err);
                })

            }).catch(err => {
                console.log('error in sending mail process');
                reject('error in sending mail process');
            })
        }).catch(err=>{
            reject(err);
        })

    });

};
getEmailByGlobalId = (id)=>{
    return new Promise((resolve, reject) => {
        collection.where('globalId', '==', id).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.data().email);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};


