var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('family_Diseases');

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
// delete post
exports.delete=(id)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).delete().then(()=>{
            resolve('item deleted successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// get all family diseases related to patient
exports.get=(username)=>{
    return new Promise((resolve, reject) => {
        collection.where('username','==',username).get().then(docs=>{
            let items = [];
            if (docs.empty) {
                console.log('No matching document.');
                reject('there is no family diseases added to this patient');
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