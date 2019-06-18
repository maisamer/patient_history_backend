var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('DietaryInformationPatient');

// add Dietary Information
exports.insertDietaryInformationPatient=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// delete Dietary Information
exports.deleteDietaryInformationPatient =(patient,id)=>{
    return new Promise((resolve, reject) => {
        searchItem(patient,id).then(ref=>{
            collection.doc(ref).delete().then(()=>{
                resolve('item delete successfully');
            }).catch(err=>{
                reject('error in delete item');
            })
        }).catch(err=>{
            reject('item not found');
        })
    });
};
const searchItem=(patient,id)=>{
    return new Promise((resolve, reject) => {
        collection.where('patient','==',patient).where('dietaryInformationId','==',id).get().then(snapshot=>{
            if (snapshot.empty) {
                console.log('No matching document.');
                reject('No matching document');
            }
            else {

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.id);
                });
            }
        })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};