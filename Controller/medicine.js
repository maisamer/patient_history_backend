var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('medicine');
exports.getMedicine=(id)=>{
    return new Promise((resolve, reject) => {
        collection.where('patientId', '==', id).get().then(docs => {
            let medicines = [];
            if (docs.empty) {
                console.log('No matching document.');
                reject('no medicine');
            }
            else {
                docs.forEach(doc => {
                    console.log(doc.id, '=>', doc.data());
                    medicines.push(doc.data());
                });
                resolve(medicines);
            }

        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting document');
        });
    });

}