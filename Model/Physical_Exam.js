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