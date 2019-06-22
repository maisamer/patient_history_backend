let physicalExamModel = require('../Model/Physical_Exam');
let patientModel = require('../Model/patient');

exports.addPhysicalExam = (req,res,next)=>{
    let patient = req.body.username;
    let blood_pressure = req.body.blood_pressure;
    let heart_rate = req.body.heart_rate;
    let date = req.body.date;
    if(patient != null && patient != undefined &&blood_pressure != null && blood_pressure != undefined && heart_rate != null && heart_rate != undefined && date != null && date != undefined){
        let PhysicalExam = {
            username:patient,
            heart_rate:heart_rate,
            blood_pressure:blood_pressure,
            date : date
        };
        let item = {
            heart_rate:heart_rate,
            blood_pressure:blood_pressure,
            date : date
        };
        patientModel.addPhysicalExam(item,patient);
        physicalExamModel.insertPhysicalExam(PhysicalExam).then(success=>{
            res.json({status:200,id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.updatePhysicalExam = (req,res,next)=>{
    let username = req.body.username;
    let id = req.body.id;
    let blood_pressure = req.body.blood_pressure;
    let heart_rate = req.body.heart_rate;
    let date = req.body.date;
    if(username != null && username != undefined && id != null && id != undefined && blood_pressure != null && blood_pressure != undefined && heart_rate != null && heart_rate != undefined && date != null && date != undefined){
        let PhysicalExam = {
            heart_rate:heart_rate,
            blood_pressure:blood_pressure,
            date : date
        };
        patientModel.addPhysicalExam(item,username);
        physicalExamModel.updatePhysicalExam(id,PhysicalExam).then(success=>{
            res.json({status:200,message:'Physical Exam updated successfully'});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.deletePhysicalExam = (req,res,next)=>{
    let id = req.body.id;
    let username = req.body.username;
    if(id != null && id != undefined && username != null && username != undefined){
        patientModel.deletePhysicalExam(username);
        physicalExamModel.deletePhysicalExam(id).then(success=>{
            res.json({status:200,message:'item deleted successfully'});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }

};
exports.getPhysicalExam = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        patientModel.getPhysicalExam(username).then(item=>{
            res.json({status:200,physicalExam:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
// get all physical exam related to user
exports.get = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        physicalExamModel.get(username).then(item=>{
            res.json({status:200,physicalExam:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};