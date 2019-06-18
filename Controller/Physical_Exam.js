let physicalExamModel = require('../Model/Physical_Exam');
let physicalExamPatientModel = require('../Model/Physical_Exam_patient');

exports.addPhysicalExam = (req,res,next)=>{
    let patient = req.body.username;
    let blood_pressure = req.body.blood_pressure;
    let heart_rate = req.body.heart_rate;
    let date = req.body.date;
    if(patient != null && patient != undefined &&blood_pressure != null && blood_pressure != undefined && heart_rate != null && heart_rate != undefined && date != null && date != undefined){
        let PhysicalExam = {
            heart_rate:heart_rate,
            blood_pressure:blood_pressure,
            date : date
        };
        physicalExamModel.insertPhysicalExam(PhysicalExam).then(success=>{
            // add physical exam patient (many to many relationship)
            physicalExamPatientModel.insertPhysicalExamPatient({patient:patient,physicalExamId:success}).then(success=>{
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
exports.updatePhysicalExam = (req,res,next)=>{
    let id = req.body.id;
    let blood_pressure = req.body.blood_pressure;
    let heart_rate = req.body.heart_rate;
    let date = req.body.date;
    if(id != null && id != undefined && blood_pressure != null && blood_pressure != undefined && heart_rate != null && heart_rate != undefined && date != null && date != undefined){
        let PhysicalExam = {
            heart_rate:heart_rate,
            blood_pressure:blood_pressure,
            date : date
        };
        physicalExamModel.updatePhysicalExam(id,PhysicalExam).then(success=>{
            res.json({status:200,message:'Physical Exam updated successfully',id:success});
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
        physicalExamModel.deletePhysicalExam(id).then(success=>{
            // delete physical exam patient (many to many relationship)
            physicalExamPatientModel.deletePhysicalExamPatient(username,id).then(success=>{
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