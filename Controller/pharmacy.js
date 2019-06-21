const patient = require('../Model/patient');
const disease = require('../Model/disease');
const medicine = require('../Model/medicine');
const model = require('../Model/pharmacy');
const comment = require('../Model/comments');

// get all medicines related to patient
exports.get =(req,res,next)=> {
    patient.getRandomUser().then(username=>{
        disease.get(username).then(diseases=>{
            var items =[];
            diseases.forEach(disease=>{
                medicine.getMedicine(disease.id).then(medicines=>{
                    items.push(medicines);
                }).catch(err=>{
                    res.json({status:404,message:err});
                })
            })
            res.json({status:200,medicine:items});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
        res.json({status:200,patient:su});
    }).catch(err=>{
        res.json({status:404,message:'there is no patient'});
    })

};
exports.comment =(req,res,next)=> {
    let user = req.body.userId;
    let des = req.body.comment;
    let pharmacy = req.body.pharmacyId;
    if(des != null && des != undefined && user != null && user != undefined &&pharmacy != null &&pharmacy != undefined){
        var item ={
            patientId:user,
            comment:des,
            pharmacyId:pharmacy
        };
        comment.insert(item).then(sucess=>{
            patient.comment(user).then(com=>{
                model.updateComment(pharmacy).then(num=>{
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
    }else{
        res.json({status:404,message:'missing data'});
    }
};