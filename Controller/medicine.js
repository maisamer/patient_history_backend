const model = require('../Model/medicine');
const medicineModel =require('../Model/medicine');
exports.getMedicineDisease =(req,res,next)=>{
    let dieaseId = req.body.diseaseId;
    if(dieaseId != null && dieaseId != undefined){
        model.getMedicineDisease(dieaseId).then(sucess=>{
            res.json({status:200,medicine:sucess});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.add =(req,res,next)=>{
    let diseaseId = req.body.diseaseId;
    let name = req.body.name;
    let treatment_for =req.body.treatment_for;
    let dose = req.body.dose;
    let times = req.body.times;
    let interval = req.body.interval;
    if(diseaseId != null && diseaseId != undefined && name != null && name != undefined && treatment_for != null && treatment_for!= null && dose != null && dose != undefined && times !=null && times != undefined && interval != null && interval != undefined){
        var item ={
            diseaseId:diseaseId,
            name:name,
            treatment_for:treatment_for,
            dose:dose,
            times:times,
            interval:interval
        };
        model.insert(item).then(sucess=>{
            res.json({status:200,medicine:sucess});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.update =(req,res,next)=>{
    let name = req.body.name;
    let treatment_for =req.body.treatment_for;
    let dose = req.body.dose;
    let times = req.body.times;
    let interval = req.body.interval;
    if(name != null && name != undefined && treatment_for != null && treatment_for!= null && dose != null && dose != undefined && times !=null && times != undefined && interval != null && interval != undefined){
        var item ={
            diseaseId:diseaseId,
            name:name,
            treatment_for:treatment_for,
            dose:dose,
            times:times,
            interval:interval
        };
        model.update(item).then(sucess=>{
            res.json({status:200,medicine:sucess});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
}
exports.getMedicine=(req,res,next)=>{
    let globalId = req.body.globalId;
    return new Promise((resolve, reject) => {
        medicineModel.getMedicine(globalId => {})

            .catch(err => {
            console.log('Error getting documents', err);
            reject('Error getting document');
        });
    });

}