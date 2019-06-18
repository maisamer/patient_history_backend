let DietaryInformationModel = require('../Model/dietary Information');
let DietaryInformationPatientModel = require('../Model/patient_Dietary_Information');

exports.addPhysicalExam = (req,res,next)=>{
    let patient = req.body.username;
    let restrictions = req.body.restrictions;
    let suplemenets = req.body.suplemenets;
    let stimulants = req.body.stimulants;
    let date = req.body.date;
    if(stimulants!= null && stimulants!= undefined && patient != null && patient != undefined &&restrictions != null && restrictions != undefined && suplemenets != null && suplemenets != undefined && date != null && date != undefined){
        let PhysicalExam = {
            restrictions:restrictions,
            suplemenets:suplemenets,
            stimulants:stimulants,
            date : date
        };
        DietaryInformationModel.insertDietaryInformation(PhysicalExam).then(success=>{
            // add physical exam patient (many to many relationship)
            DietaryInformationPatientModel.insertDietaryInformationPatient({patient:patient,physicalExamId:success}).then(success=>{
                res.json({status:200,message:'Dietary Information added successfully',id:success});
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
    let restrictions = req.body.restrictions;
    let suplemenets = req.body.suplemenets;
    let stimulants = req.body.stimulants;
    let date = req.body.date;
    if(stimulants!= null && stimulants!= undefined && restrictions != null && restrictions != undefined && suplemenets != null && suplemenets != undefined && date != null && date != undefined){
        let PhysicalExam = {
            restrictions:restrictions,
            suplemenets:suplemenets,
            stimulants:stimulants,
            date : date
        };
        DietaryInformationModel.updateDietaryInformation(id,PhysicalExam).then(success=>{
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
        DietaryInformationModel.deleteDietaryInformation(id).then(success=>{
            // delete physical exam patient (many to many relationship)
            DietaryInformationPatientModel.deleteDietaryInformationPatient(username,id).then(success=>{
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