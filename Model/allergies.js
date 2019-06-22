var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('Allergies');

// add Allergies
exports.insertAllergies=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// update Allergies
exports.updateAllergies=(id,item)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update(item).then(()=>{
            resolve('item update successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// delete Allergies
exports.deleteAllergies =(id)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).delete().then(() => {
            resolve('item delete successfully');
        })
            .catch(err => {
                //console.log('Error deleting documents', err);
                reject('Error : data connection');
            });
    });
};
// get all allergies
exports.get =(username)=> {
    return new Promise((resolve, reject) => {
        collection.where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }else {
                    var items = [];
                    snapshot.forEach(doc => {
                        items.push(doc.data());
                    });
                    resolve(items);
                }
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};