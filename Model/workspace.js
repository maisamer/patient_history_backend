var admin = require("firebase-admin");
const db = admin.firestore();
const  collection = db.collection('workspace');
exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.search=(username)=>{
    return new Promise((resolve, reject) => {
        collection.where('username','==',username).get().then(docs=>{
            let items = [];
            if (docs.empty) {
                console.log('No matching document.');
                reject('no posts here');
            }
            else {
                docs.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    items.push(doc.id);
                })
                resolve(items);
            }
        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting documents');
        });
    });
};
