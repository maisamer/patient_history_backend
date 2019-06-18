// socialHabit
let socialHabitModel = require('../Model/Social Habit');
let socialHabitPatientModel = require('../Model/social_Habit_patient');

exports.addSocial_habit = (req,res,next)=>{
    let patient = req.body.username;
    let tobacco = req.body.tobacco;
    let alcohol = req.body.alcohol;
    let illicit_drugs = req.body.illicit_drugs;
    let date = req.body.date;
    if(patient != null && patient != undefined && tobacco != null && tobacco != undefined && alcohol != null && alcohol != undefined && date != null && date != undefined
        && illicit_drugs !=null && illicit_drugs!= undefined){
        let social_habit = {
            tobacco:tobacco,
            alcohol:alcohol,
            illicit_drugs:illicit_drugs,
            date : date
        };
        socialHabitModel.insertSocialHabit(social_habit).then(success=>{
            // add physical exam patient (many to many relationship)
            socialHabitPatientModel.insertSocialHabitPatient({patient:patient,socialHabitId:success}).then(success=>{
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
exports.updateSocial_habit = (req,res,next)=>{
    let id = req.body.id;
    let tobacco = req.body.tobacco;
    let alcohol = req.body.alcohol;
    let illicit_drugs = req.body.illicit_drugs;
    let date = req.body.date;
    if(id != null && id != undefined && tobacco != null && tobacco != undefined && alcohol != null && alcohol != undefined && date != null && date != undefined && illicit_drugs !=null && illicit_drugs!= undefined ){
        let social_habit = {
            tobacco:tobacco,
            alcohol:alcohol,
            illicit_drugs:illicit_drugs,
            date : date
        };
        socialHabitModel.updateSocialHabit(id,social_habit).then(success=>{
            res.json({status:200,message:'social habit updated successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.deleteSocial_habit = (req,res,next)=>{
    let id = req.body.id;
    let username = req.body.username;
    if(id != null && id != undefined && username != null && username != undefined){
        socialHabitModel.deleteSocialHabit(id).then(success=>{
            // delete physical exam patient (many to many relationship)
            socialHabitPatientModel.deleteSocialHabitPatient(username,id).then(success=>{
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