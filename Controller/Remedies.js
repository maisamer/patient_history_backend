let RemediesModel = require('../Model/Remedies');
let patientModel = require('../Model/patient');

exports.add = (req,res,next)=>{
    let patient = req.body.username;
    let start_date = req.body.start_date;
    let name = req.body.name;
    let dose = req.body.dose;
    let date = req.body.date;
    let outcome = req.body.outcome;
    if(outcome != null && outcome != undefined &&start_date != null && start_date != undefined && patient != null && patient != undefined &&name != null && name != undefined && dose != null && dose != undefined && date != null && date != undefined){
        let item= {
            username:patient,
            start_date:start_date,
            name:name,
            dose:dose,
            date : date,
            outcome:outcome
        };
        let itm= {
            start_date:start_date,
            name:name,
            dose:dose,
            date : date,
            outcome:outcome
        };
        patientModel.addRemedies(itm,patient);
        RemediesModel.insertRemedies(item).then(success=>{
            res.json({status:200,id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.update = (req,res,next)=>{
    let username = req.boby.username;
    let id = req.body.id;
    let start_date = req.body.start_date;
    let name = req.body.name;
    let dose = req.body.dose;
    let date = req.body.date;
    let outcome = req.body.outcome;
    if(username != null && username != undefined &&outcome != null && outcome != undefined &&start_date != null && start_date != undefined &&name != null && name != undefined && dose != null && dose != undefined && date != null && date != undefined){
        let item= {
            start_date:start_date,
            name:name,
            dose:dose,
            date : date,
            outcome:outcome
        };
        patientModel.addRemedies(item,username).then(success=>{
            console.log(success);
        })
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
        patientModel.deleteRemedies(username);
        RemediesModel.deleteRemedies(id).then(success=>{
            res.json({status:200,message:'item delete successfully'});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.getRemedies = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        patientModel.getRemedies(username).then(item=>{
            res.json({status:200,Remedies:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
// get all remides related to user
exports.get = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        RemediesModel.get(username).then(item=>{
            res.json({status:200,Remedies:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};