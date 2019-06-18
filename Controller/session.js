let sessionModel = require('../Model/session');
// add session to db
exports.addSession = (req,res,next)=>{
    let doctor = req.body.doctor;
    let patient = req.body.patient;
    let date = new Date();
    let description = req.body.description;
    if(patient != null && patient != undefined && doctor != null && doctor != undefined && description != null && description != undefined){
        let session = {
            doctor:doctor,
            patient:patient,
            date : date,
            description:description,
        };
        sessionModel.insertSession(session).then(success=>{
            res.json({status:200,message:'session added successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.updateSession = (req,res,next)=> {
    let id = req.body.id;
    let description = req.body.description;
    if(id != null && id != undefined && description!= null && description != undefined) {
        sessionModel.updateSession(id, description).then(success => {
            res.json({status:200,message:'item update successfully'});
        }).catch(err => {
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
}