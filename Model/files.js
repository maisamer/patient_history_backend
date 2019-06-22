const admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('files');

exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref => {
            console.log('item added successfully', ref.id);
            resolve('item added successfully')
        }).catch(err => {
            console.log(err);
            reject(err)
        })
    });
};