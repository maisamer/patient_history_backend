// socialHabit
let socialHabitModel = require('../Model/Social Habit');
var patientModel = require('../Model/patient');

exports.addSocial_habit = (req,res,next)=>{
    let patientUsername = req.body.username;
    let tobacco = req.body.tobacco;
    let alcohol = req.body.alcohol;
    let illicit_drugs = req.body.illicit_drugs;
    let date = req.body.date;
    if(patientUsername != null && patientUsername != undefined && tobacco != null && tobacco != undefined && alcohol != null && alcohol != undefined && date != null && date != undefined
        && illicit_drugs !=null && illicit_drugs!= undefined){
        let social_habit = {
            username:patientUsername,
            tobacco:tobacco,
            alcohol:alcohol,
            illicit_drugs:illicit_drugs,
            date : date
        };
        var item={
            tobacco:tobacco,
            alcohol:alcohol,
            illicit_drugs:illicit_drugs,
            date : date
        };
        patientModel.addSocialHabit(item,patientUsername).then(success=>{
            console.log(success);
        });
        socialHabitModel.insertSocialHabit(social_habit).then(success=>{
            res.json({status:200,message:'item added successfully',id:success});

        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.updateSocial_habit = (req,res,next)=>{
    let patientUsername = req.body.username;
    let id = req.body.id;
    let tobacco = req.body.tobacco;
    let alcohol = req.body.alcohol;
    let illicit_drugs = req.body.illicit_drugs;
    let date = req.body.date;
    if(patientUsername != null && patientUsername != undefined && id != null && id != undefined && tobacco != null && tobacco != undefined && alcohol != null && alcohol != undefined && date != null && date != undefined && illicit_drugs !=null && illicit_drugs!= undefined ){
        let social_habit = {
            tobacco:tobacco,
            alcohol:alcohol,
            illicit_drugs:illicit_drugs,
            date : date
        };
        patientModel.addSocialHabit(social_habit,patientUsername).then(success=>{
            console.log(success);
        });
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
        patientModel.deleteSocialHabit(username);
        socialHabitModel.deleteSocialHabit(id).then(success=>{
            res.json({status:200,message:'item deleted successfully'});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.getSocial_habit = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        patientModel.getSocialHabit(username).then(item=>{
            res.json({status:200,socialHabit:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.get = (req,res,next)=>{
    let username = req.body.username;
    if( username != null && username != undefined){
        socialHabitModel.get(username).then(item=>{
            res.json({status:200,socialHabits:item});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};