let DietaryInformationModel = require('../Model/dietary Information');
let patientModel = require('../Model/patient');

exports.add = (req,res,next)=>{
    let patient = req.body.username;
    let restrictions = req.body.restrictions;
    let suplemenets = req.body.suplemenets;
    let stimulants = req.body.stimulants;
    let date = new Date();
    if(stimulants!= null && stimulants!= undefined && patient != null && patient != undefined &&restrictions != null && restrictions != undefined && suplemenets != null && suplemenets != undefined && date != null && date != undefined){
        let PhysicalExam = {
            username:patient,
            restrictions:restrictions,
            suplemenets:suplemenets,
            stimulants:stimulants,
            date : date
        };
        let item = {
            restrictions:restrictions,
            suplemenets:suplemenets,
            stimulants:stimulants,
            date : date
        };
        patientModel.addDietaryInformation(item,patient);
        DietaryInformationModel.insertDietaryInformation(PhysicalExam).then(success=>{
            res.json({status:200,id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.update = (req,res,next)=>{
    let username = req.body.username;
    let id = req.body.id;
    let restrictions = req.body.restrictions;
    let suplemenets = req.body.suplemenets;
    let stimulants = req.body.stimulants;
    let date = req.body.date;
    if(username!= null && username != undefined &&stimulants!= null && stimulants!= undefined && restrictions != null && restrictions != undefined && suplemenets != null && suplemenets != undefined && date != null && date != undefined){
        let PhysicalExam = {
            restrictions:restrictions,
            suplemenets:suplemenets,
            stimulants:stimulants,
            date : date
        };
        patientModel.addDietaryInformation(PhysicalExam,username);
        DietaryInformationModel.updateDietaryInformation(id,PhysicalExam).then(success=>{
            res.json({status:200,message:'Physical Exam updated successfully',id:success});
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
        patientModel.deleteADietaryInformation(username);
        DietaryInformationModel.deleteDietaryInformation(id).then(success=>{
            res.json({status:200,message:'item delete successfully'});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }

};
exports.getDietaryInformation = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        patientModel.getPhysicalExam(username).then(item=>{
            res.json({status:200,DietaryInformation:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
// get all  related to user
exports.get = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        DietaryInformationModel.get(username).then(item=>{
            res.json({status:200,DietaryInformation:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};