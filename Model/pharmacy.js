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
            collection.doc(doc.id).update({comments:doc.data().comments+1}).then(()=>{
                resolve(doc.data().comments);
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
