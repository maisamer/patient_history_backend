var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('session');

exports.insertSession=(item)=>{
    return new Promise((resolve, reject) => {
       collection.add(item).then(ref=>{
           resolve(ref.id);
       }).catch(err=>{
           reject('error in db connection');
       })
    });
};
exports.updateSession=(id,description)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update({description:description}).then(()=>{
            resolve('item updated successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};