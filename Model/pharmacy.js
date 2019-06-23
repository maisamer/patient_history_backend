var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('pharmacy');
const patient = require('../Model/patient');
const medicine = require('../Model/medicine');
exports.getPharmacyName=(username)=>{
    return new Promise((resolve, reject) => {
        collection.where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve({name:doc.data().name,id:doc.id});
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
exports.updateComment=(id)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).get().then(doc=>{
            collection.doc(doc.id).update({comments:doc.data().comments+1}).then(()=>{
                resolve(doc.data().comments+1);
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
exports.getRandomPation=()=>{
    return new Promise((resolve, reject) => {
        patient.getRandomUser().then(item=>{
            //console.log('username ',username);
            medicine.getMedicineByUsername(item.username).then(med=>{
                resolve({id:item.id,medicines:med});
            }).catch(err=>{
                reject(err);
            })
        }).catch(err=>{
            reject(err);
        })
    });
};
