var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('PhysicalExam');

// add physical exam
exports.insertPhysicalExam=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// update physical exam
exports.updatePhysicalExam=(id,item)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update(item).then(()=>{
            resolve('item update successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// delete physical exam
exports.deletePhysicalExam =(id)=>{
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
// get all physical exam
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