var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('pharmacy');

exports.updateComment=(id)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).get().then(doc=>{
            collection.doc(doc.id).update({comments:doc.data().comment+1}).then(()=>{
                resolve(doc.data().comment+1);
            }).catch(err=>{
                console.log(err);
                reject(err);
            })
        }).catch(err=>{
            console.log(err);
            reject(err);
        })
    });
};