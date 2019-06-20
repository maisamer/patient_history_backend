var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('medicine');

exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.update=(id,item)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update(item).then(()=>{
            resolve('item updated successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.getMedicineDisease=(diseaseId)=>{
    return new Promise((resolve, reject) => {
        collection.where('diseaseId','==',diseaseId).get().then(docs=>{
            let items = [];
            if (docs.empty) {
                console.log('No matching document.');
                reject('no medicine added to these disease here');
            }
            else {
                docs.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    items.push(doc.id,doc.data());
                })
                resolve(items);
            }
        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting documents');
        });
    });
};
exports.getMedicine=(id)=>{
    return new Promise((resolve, reject) => {
        collection.where('globalId', '==', id).get().then(docs => {
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

};