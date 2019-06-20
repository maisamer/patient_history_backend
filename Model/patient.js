var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('patient-account');
const conf = require('../Controller/configration');

// register
exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// log in
exports.get=(username,password)=>{
    return new Promise((resolve, reject) => {
        conf.checkUsername('patient-account',username).then(id=>{
            collection.doc(id).get()
                .then(doc => {
                    if (!doc.exists) {
                        console.log('No such document!');
                        reject('No such document!');
                    } else {
                        if(password==doc.data().passsword){
                            resolve(doc.data);
                        }else{
                            console.log('wrong password');
                            reject('wrong password');
                        }
                    }

                })
                .catch(err => {
                    console.log('Error getting documents', err);
                    reject('Error getting documents');
                });
        }).catch(err=>{
            reject('invalid username');
        })

    });
};
// delete account
exports.delete=(username)=>{
    return new Promise((resolve, reject) => {
        conf.checkUsername(username).then(id=>{
            collection.doc(id).delete().then(()=>{
                resolve('item deleted successfully');
            }).catch(err=>{
                reject('error in db connection');
            })
        }).catch(err=>{
            reject('username not found')
        })

    });
};

