var express = require('express');
var router = express.Router();
var admin = require("firebase-admin");


const db = admin.firestore();
const clinicColl = db.collection('clinic');
router.post('/add',function (req,res,next) {
    if(req.body.doctorId != null && req.body.doctorId != undefined &&req.body.address != null && req.body.phone != null && req.body.address != undefined &&req.body.phone != undefined){
        clinicColl.add({
            doctorId : req.body.doctorId,
            address : req.body.address,
            phone : req.body.phone
        }).then(ref => {
            console.log('Added document with ID: ', ref.id);
            res.json({status : 200,message:'clinic added successfully'})
        })
        .catch(err => {
            console.log('Error adding documents', err);
        });

    }else{
        res.json({status : 404,message:'request params is undefined'})
    }
});

router.get('/:id',function (req,res,next) {
    let reqId = req.params.id;
    clinicColl.doc(reqId).get()
        .then(doc => {
            if (doc.exists) {
                console.log('clinic found successfully');
                return res.json({status:200,message:'clinic found',clinicData:doc.data()});
            }else{
                console.log('clinic not found');
                return res.json({status:404,message:'clinic not found'});
            }

        })
        .catch(err => {
            console.log('Error getting documents', err);
        });

});
router.post('/update',function (req,res,next) {
    let address = req.body.address;
    let phone = req.body.phone;
    let id = req.body.id;
    clinicColl.doc(id).update({
       address : address,
       phone : phone
    }).then(ref=>{
        console.log('element update successfully');
        res.json({status:200,message:'element update successfully'});
    })
    .catch(err => {
        console.log('Error updating documents', err);
        res.json({status:404,message:'Error : element not found'});
    });
});
module.exports = router;