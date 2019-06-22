var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('follow');

exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.getAllPatient=(doctorUsername)=>{
    return new Promise((resolve, reject) => {
        collection.where('doctorUsername', '==', doctorUsername).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }
                else {
                    var users = [];
                    snapshot.forEach(doc => {
                        console.log(doc.id);
                        users.push(doc.data().patientUsername);
                    });
                    resolve(users);
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
exports.checkPermision=(doctorUsername,patientUsername)=>{
    return new Promise((resolve, reject) => {
        collection.where('doctorUsername', '==', doctorUsername).where('patientUsername', '==', patientUsername).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    //console.log('already have permission');
                    resolve('No matching document');
                }
                else {
                    snapshot.forEach(doc => {
                        reject(doc.id);
                    });

                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};