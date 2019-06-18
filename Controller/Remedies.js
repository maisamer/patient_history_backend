let RemediesModel = require('../Model/Remedies');
let RemediesPatientModel = require('../Model/patient_Remedies');

exports.add = (req,res,next)=>{
    let patient = req.body.username;
    let start_date = req.body.start_date;
    let name = req.body.name;
    let dose = req.body.dose;
    let date = req.body.date;
    let outcome = req.body.outcome;
    if(outcome != null && outcome != undefined &&start_date != null && start_date != undefined && patient != null && patient != undefined &&name != null && name != undefined && dose != null && dose != undefined && date != null && date != undefined){
        let item= {
            start_date:start_date,
            name:name,
            blood_pressure:blood_pressure,
            date : date,
            outcome:outcome
        };
        RemediesModel.insertRemedies(item).then(success=>{
            // add physical exam patient (many to many relationship)
            RemediesPatientModel.insert({patient:patient,physicalExamId:success}).then(success=>{
                res.json({status:200,message:'Physical Exam added successfully',id:success});
            }).catch(err=>{
                res.json({status:404,message:'error in add ref connection please try again'});
            })

        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.update = (req,res,next)=>{
    let id = req.body.id;
    let start_date = req.body.start_date;
    let name = req.body.name;
    let dose = req.body.dose;
    let date = req.body.date;
    let outcome = req.body.outcome;
    if(outcome != null && outcome != undefined &&start_date != null && start_date != undefined &&name != null && name != undefined && dose != null && dose != undefined && date != null && date != undefined){
        let item= {
            start_date:start_date,
            name:name,
            blood_pressure:blood_pressure,
            date : date,
            outcome:outcome
        };
        RemediesModel.updateRemedies(id,item).then(success=>{
            res.json({status:200,message:'Remedies updated successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.delete = (req,res,next)=>{
    let id = req.body.id;
    let username = req.body.username;
    if(id != null && id != undefined && username != null && username != undefined){
        RemediesModel.deleteRemedies(id).then(success=>{
            // delete physical exam patient (many to many relationship)
            RemediesPatientModel.delete(username,id).then(success=>{
                res.json({status:200,message:'item delete successfully'});
            }).catch(err=>{
                res.json({status:404,message:'error in connection please try again'});
            })
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }

};