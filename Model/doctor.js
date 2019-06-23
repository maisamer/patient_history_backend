var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('doctor-account');
const conf = require('../Controller/configration');

exports.rate=(username,rate)=>{
    return new Promise((resolve, reject) => {
        if (rate == 1 || rate ==1) {
            conf.checkUsername(username).then(id => {
                collection.doc(id).get()
                    .then(doc => {
                        if (!doc.exists) {
                            console.log('No such document!');
                            reject('No such document!');
                        } else {
                            if(rate==1){
                                collection.doc(id).update({posRate:doc.data().posRate+1}).then(()=>{
                                    console.log('rate updated successfully');
                                    resolve('rate updated successfully');
                                }).catch(err=>{
                                    console.log('error in connection please try again');
                                    reject('error in connection please try again');
                                })
                            }else{
                                collection.doc(id).update({negRate:doc.data().negRate+1}).then(()=>{
                                    console.log('rate updated successfully');
                                    resolve('rate updated successfully');
                                }).catch(err=>{
                                    console.log('error in connection please try again');
                                    reject('error in connection please try again');
                                })
                            }
                        }

                    })
                    .catch(err => {
                        console.log('Error getting documents', err);
                        reject('Error getting documents');
                    });
            }).catch(err=>{
                console.log('invalid username');
                reject('invalid username');
            })

        }
        else{
            console.log('invalid symbol');
            reject('invalid symbol');
        }
    });
};
exports.insert=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.get=(username,password)=>{
    return new Promise((resolve, reject) => {
        conf.checkUsername('doctor-account',username).then(id=>{
            collection.doc(id).get()
                .then(doc => {
                    if (!doc.exists) {
                        console.log('No such document!');
                        reject('No such document!');
                    } else {
                        if(password==doc.data().passsword){
                            resolve(doc.data());

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
exports.delete=(username)=>{
    return new Promise((resolve, reject) => {
        conf.checkUsername('doctor-account',username).then(id=>{
            console.log(id);
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
// searchById
exports.getById=(id)=>{
    return new Promise((resolve, reject) => {
        collection.where('globalId', '==', id).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.data().username);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
exports.getGlobalId=(username)=>{
    return new Promise((resolve, reject) => {
        collection.where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.data().globalId);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
