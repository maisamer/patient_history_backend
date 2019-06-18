let AllergiesModel = require('../Model/allergies');
let AllergiesPatientModel = require('../Model/patient_Allergies');

exports.addAllergies = (req,res,next)=>{
    let patient = req.body.username;
    let name = req.body.name;
    let date = req.body.date;
    if(patient != null && patient != undefined && name != null && name != undefined &&  date != null && date != undefined){
        let item = {
            name:name,
            date : date
        };
        AllergiesModel.insertAllergies(item).then(success=>{
            // add physical exam patient (many to many relationship)
            AllergiesPatientModel.insertPatientAllergies({patient:patient,physicalExamId:success}).then(success=>{
                res.json({status:200,message:'Allergies added successfully',id:success});
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
exports.updateAllergies = (req,res,next)=>{
    let id = req.body.id;
    let name = req.body.name;
    let date = req.body.date;
    if(id != null && id != undefined && name != null && name != undefined &&  date != null && date != undefined){
        let item = {
            name:name,
            date : date
        };
        AllergiesModel.updateAllergies(id,item).then(success=>{
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
        AllergiesModel.deleteAllergies(id).then(success=>{
            // delete physical exam patient (many to many relationship)
            AllergiesPatientModel.deletePatientAllergies(username,id).then(success=>{
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