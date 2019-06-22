let allerModel = require('../Model/allergies');
let patientModel = require('../Model/patient');
exports.addAllergies = (req,res,next)=>{
    let patient = req.body.username;
    let name = req.body.name;
    let date = req.body.date;
    if(patient != null && patient != undefined && name != null && name != undefined &&  date != null && date != undefined){
        let item = {
            username:patient,
            name:name,
            date : date
        };
        let itm ={
            name:name,
            date : date
        };
        patientModel.addAllergies(itm,patient);
        allerModel.insertAllergies(item).then(success=>{
            res.json({status:200,id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.updateAllergies = (req,res,next)=>{
    let username = req.body.username;
    let id = req.body.id;
    let name = req.body.name;
    let date = req.body.date;
    if(username != null && username != undefined &&id != null && id != undefined && name != null && name != undefined &&  date != null && date != undefined){
        let item = {
            name:name,
            date : date
        };
        patientModel.addAllergies(item,username);
        allerModel.updateAllergies(id,item).then(success=>{
            res.json({status:200,message:'Physical Exam updated successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.deleteAllergies = (req,res,next)=>{
    let id = req.body.id;
    let username = req.body.username;
    if(id != null && id != undefined && username != null && username != undefined){
        patientModel.deleteAllergies(username);
        allerModel.deleteAllergies(id).then(success=>{
            res.json({status:200,message:'item delete successfully'});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.getAllergies = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        patientModel.getAllergies(username).then(item=>{
            res.json({status:200,Allergies:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
// get all Allergies related to user
exports.get = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        allerModel.get(username).then(item=>{
            res.json({status:200,Allergies:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};