const admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('patient-account');
const conf = require('../Controller/configration');
const model = require('../Model/disease');
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
        collection.where('number_of_medicine', '>', 1).where('comment','==','no').get().then(docs => {
            if (docs.empty) {
                console.log('No matching document.');
                reject('no patient');
            }
            else {
                docs.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    resolve(doc.data().username);
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
