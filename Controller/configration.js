var admin = require("firebase-admin");
const db = admin.firestore();
exports.checkUsername = (collection_name,username)=>{
    return new Promise((resolve, reject) => {
        db.collection(collection_name).where('username', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.id);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
exports.checkEmail = (collection_name,email)=>{
    return new Promise((resolve, reject) => {
        db.collection(collection_name).where('email', '==', email).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.id);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
}
exports.getEmail = (collection_name,id)=>{
    return new Promise((resolve, reject) => {
        db.collection(collection_name).doc(id).get()
            .then(doc => {
                if (!doc.exists) {
                    reject('No such document!');
                } else {
                    resolve(doc.data().email);
                }

            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};
exports.getDoctorById = (collection_name,username)=>{
    return new Promise((resolve, reject) => {
        db.collection(collection_name).where('globalId', '==', username).get()
            .then(snapshot => {
                if (snapshot.empty) {
                    console.log('No matching document.');
                    reject('No matching document');
                }

                snapshot.forEach(doc => {
                    console.log(doc.id)
                    resolve(doc.id);
                });
            })
            .catch(err => {
                console.log('Error getting documents', err);
                reject('Error getting documents');
            });
    });
};