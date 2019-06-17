var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('patient-account');
exports.getallusers =()=>{
    return new Promise((resolve, reject) => {
        collection.where('number_of_medicine', '>', 1).get().then(docs => {
            let patients = [];
            if (docs.empty) {
                console.log('No matching document.');
                reject('no patient');
            }
            else {
                docs.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    patients.push(doc.data().globalId);
                });
                resolve(patients);
            }

        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting document');
        });
    });
};