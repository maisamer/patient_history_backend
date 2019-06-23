const patient = require('../Model/patient');
const model = require('../Model/pharmacy');
const comment = require('../Model/comments');


// get all medicines related to random patient
exports.get =(req,res,next)=> {
    model.getRandomPation().then((medicine)=>{
        //console.log('medicine : ' ,medicine);
        res.json({status:200,medicine:medicine});
    }).catch(err=>{
        console.log(err);
        res.json({status:404,message:err});
    })

};
exports.comment =(req,res,next)=> {
    let user = req.body.userId;
    let des = req.body.comment;
    let pharmacy = req.body.pharmacyId;
    console.log(comment);
    if(des != null && des != undefined && user != null && user != undefined &&pharmacy != null &&pharmacy != undefined){
        var item ={
            patientId:user,
            comment:des,
            pharmacyId:pharmacy
        };

        comment.insert(item).then(sucess=>{

            patient.comment(user).then(com=>{
                patient.sendEmail(pharmacy,user,des).then(id=>{
                model.updateComment(id).then(num=>{

                    res.json({status:200,comments:num});
                }).catch(err=>{
                    res.json({status:404,message:err});
                })
            }).catch(err=>{
                res.json({status:404,message:err});
            })
        }).catch(err=>{
            console.log(err);
            res.json({status:404,message:err});
        })
        }).catch(err=>{
            console.log('here',err);
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};