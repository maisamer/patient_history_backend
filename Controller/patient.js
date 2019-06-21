let model = require('../Model/patient');
let conf = require('../Controller/configration');
let mail = require('../Controller/Email');

/*
 globalId
 name , nationalId , phone number , age , blood , comment , number_of_medicine
 */
exports.register= (req,res,next)=> {
    let username = req.body.username;
    let email = req.body.passsword;
    let phone = req.body.phone;
    let name = req.body.name;
    let comment = 0;
    let age = req.body.age;
    let nationalId = req.body.nationalId;
    let number_of_medicine = 0;
    let globalId =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    let password = `${Math.random().toString(36).substring(7)}_${Date.now()}`;
    if(nationalId != null && nationalId != undefined &&username != null && username != undefined && email != null && email != undefined && name != null && name != undefined && phone != null && phone != undefined && age != null && age != undefined){
        conf.checkEmail('patient-account',email).then(suc=>{
            res.json({status:404,message:'this email is already exist'});
        }).catch(err=>{
            // send email
            mail.registrationMailPlace(email,username,password).then(success=>{
                var item ={
                    nationalId : nationalId ,
                    globalId:globalId,
                    username:username,
                    email:email,
                    phone:phone,
                    name:name,
                    comment:comment,
                    number_of_medicine:number_of_medicine
                };
                model.insert(item).then(ref=>{
                    res.json({status:200,message:'check your email please'});
                }).catch(err=>{
                    res.json({status:404,message:err});
                });
            }).catch(err=>{
                res.json({status:404,message:'error in sending mail please try again'});
            })

        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
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