var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('post');

exports.insertPost=(item)=>{
    return new Promise((resolve, reject) => {
        collection.add(item).then(ref=>{
            resolve(ref.id);
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
exports.updatePost=(id,item)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).update(item).then(()=>{
            resolve('item updated successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// delete post
exports.deletePost=(id)=>{
    return new Promise((resolve, reject) => {
        collection.doc(id).delete().then(()=>{
            resolve('item deleted successfully');
        }).catch(err=>{
            reject('error in db connection');
        })
    });
};
// get all posts
exports.getPosts=()=>{
    return new Promise((resolve, reject) => {
        collection.get().then(docs=>{
            let posts = [];
            if (docs.empty) {
                console.log('No matching document.');
                reject('no posts here');
            }
            else {
                docs.forEach(doc => {
                    //console.log(doc.id, '=>', doc.data());
                    posts.push(doc.id,doc.data());
                })
                resolve(posts);
            }
        }).catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting documents');
        });
    });
};