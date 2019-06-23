var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('appointment');

exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.update=(item)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update().then(()=>{
            resolve('item updated successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// get all appointments that related to clinic
exports.get=(clinicUsername)=>{
    return new Promise((resolve, reject) => {
        collection.where('clinicUsername', '==', clinicUsername).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('there is no appointment to clinic');
                }
                else {
                    let appointments =[];
                    snapshot.forEach(doc => {
                        appointments.push({from:doc.data().from,to:doc.data().to,date:doc.data().date});
                    });
                    resolve(appointments);
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
