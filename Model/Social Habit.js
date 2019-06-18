var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('socialHabit');

// add social Habit
exports.insertSocialHabit=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// update social Habit
exports.updateSocialHabit=(id,item)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update(item).then(()=>{
            resolve('item update successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// delete social Habit
exports.deleteSocialHabit =(id)=>{
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