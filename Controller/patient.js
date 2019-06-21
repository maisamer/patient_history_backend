var admin = require("firebase-admin");
const db = admin.firestore();
const collection = db.collection('patient-account');
let model = require('../Model/patient');

/*
 globalId
 nationalId
 name , nationalId , phone number , age , blood , comment
 */
exports.login = (req,res,next)=>{
  let username = req.body.username;
  let password = req.body.passsword;
  if(username != null && username != undefined && password != null && password != undefined){
        model.get(username,password).then(sucess=>{
            res.json({status:200,user:sucess});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
  }else{
      res.json({status:404,message:'missing data'});
  }

};

// name , nationalId , phone number , age , blood , disease
exports.searchById =(req,res,next)=>{
    console.log('hi');
    let globalId = req.body.id;
    if(globalId != null && globalId != undefined){
        console.log('hereeeeeeee');
        model.getPatientById(globalId).then(out=>{
            res.json({status:200,data:out});
        }).catch(err=>{
            console.log(err);
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};