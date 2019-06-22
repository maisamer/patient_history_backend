var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('pharmacy');
const patient = require('../Model/patient');
const medicine = require('../Model/medicine');
exports.getPharmacyName=(id)=>{

    collection.doc(id).get().then(doc=>{
        console.log(doc.data().name);
        return doc.data().name;
    });
    return null;
};
exports.updateComment=(id)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).get().then(doc=>{
            collection.doc(doc.id).update({comments:doc.data().comment+1}).then(()=>{
                resolve(doc.data().comment+1);
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
        patient.getRandomUser().then(username=>{
            //console.log('username ',username);
            medicine.getMedicineByUsername(username).then(med=>{
                resolve(med);
            }).catch(err=>{
                reject(err);
            })
        }).catch(err=>{
            reject(err);
        })
    });
};
