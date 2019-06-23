let model = require('../Model/patient');
let conf = require('../Controller/configration');
let mail = require('../Controller/Email');
let fileConfig = require('../Controller/fileConfigration');
let follow = require('../Model/follow');
let doctorModel = require('../Model/doctor');

/*
 globalId
 name , nationalId , phone number , age , blood , comment , number_of_medicine
 */
exports.register= (req,res,next)=> {
    let username = req.body.username;
    let email = req.body.email;
    let phone = req.body.phone;
    let name = req.body.name;
    let comment = 'no';
    let age = req.body.age;
    let nationalId = req.body.nationalId;
    let number_of_medicine = 0;
    console.log(username,email,name,age,nationalId,phone);
    let globalId =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    let password = `${Math.random().toString(36).substring(7)}_${Date.now()}`;
    if(nationalId != null && nationalId != undefined &&username != null && username != undefined && email != null && email != undefined && name != null && name != undefined && phone != null && phone != undefined && age != null && age != undefined){
        conf.checkUsername('patient-account',username).then(ok=>{
            console.log('username already exist');
            res.json({status:404,message:'this username is already exist'});
        }).catch(err=>{
            conf.checkEmail('patient-account',email).then(suc=>{
                console.log('email already exist');
                res.json({status:404,message:'this email is already exist'});
            }).catch(err=>{
                // send email
                mail.registrationMailPlace(email,username,password).then(success=>{
                    var item ={
                        password:password,
                        nationalId : nationalId ,
                        globalId:globalId,
                        username:username,
                        email:email,
                        phone:phone,
                        name:name,
                        comment:comment,
                        age:age,
                        number_of_medicine:number_of_medicine
                    };
                    model.insert(item).then(ref=>{
                        console.log('check your email please');
                        res.json({status:200,message:'check your email please'});
                    }).catch(err=>{
                        console.log('err',err);
                        res.json({status:404,message:err});
                    });
                }).catch(err=>{
                    console.log('errr' ,err);
                    res.json({status:404,message:'error in sending mail please try again'});
                })

            })
        })
    }else{
        console.log('missing data');
        res.json({status:404,message:'missing data'});
    }
};
exports.addInf= (req,res,next)=> {
    let username = req.body.username;
    let blood = req.body.bloodType;
    let socialStatus = req.body.socialStatus;
    let numberOfChildren = req.body.numberOfChildren;
    let address = req.body.address;
    console.log(username,address);
    if(username != null && username != undefined &&blood != null && blood != undefined && address != null && address != undefined && numberOfChildren != null && numberOfChildren != undefined && socialStatus != null && socialStatus!= undefined ){
        var item={
            blood:blood,
            socialStatus:socialStatus,
            numberOfChildren:numberOfChildren,
            address:address
        };
        model.addinfo(username,item).then(sucess=>{
            res.json({status:200,message:sucess});
        }).catch(err=>{
            console.log(err);
            res.json({status:404,message:err});
        })
    }else{
        console.log('missing data');
        res.json({status:404,message:'missing data'});
    }
};
// user login
exports.login = (req,res,next)=>{
  let username = req.body.username;
  let password = req.body.password;
  console.log(username,password);
  if(username != null && username != undefined && password != null && password != undefined){
        model.get(username,password).then(sucess=>{
            // get profile picture if exist
            if(sucess.user.url != undefined && sucess.user.url != null && sucess.user.url != ""){
                fileConfig.downloadFil(sucess.user.url).then(buf=>{
                    res.json({status:200,user:sucess,image:buf});
                }).catch(err=>{
                    console.log('fail to upload image');
                    res.json({status:200,user:sucess});
                })
            }else{
                console.log('no image found');
                res.json({status:200,user:sucess});
            }
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
exports.updateProfilePicture=(req,res,next)=>{
    let username = req.body.username;
    let file = req.file;
    if(file && username != null && username != undefined){
        fileConfig.uploadFileToStorage(file).then(storageName=>{
            conf.getUser(username).then(obj=>{
                model.updateProfilePicture(storageName,obj.id,obj.url).then(sucess=>{

                    //res.json({status:404,message:'missing data'});
                }).catch(err=>{
                    res.json({status:404,message:'error in updating name '});
                })
            }).catch(err=>{
                res.json({status:404,message:err});
            })
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.givePermission=(req,res,next)=> {
    let patientUsername = req.body.username;
    let name = req.body.name;
    let id = req.body.doctorusername;
    if(name != null && name != undefined && id!= null && id != undefined && patientUsername != null && patientUsername != null){
        doctorModel.getById(id).then(doctorUsername=>{
            follow.checkPermision(doctorUsername,patientUsername).then(success=>{
                follow.insert({doctorUsername:doctorUsername,patientUsername:patientUsername,name:name}).then(success=>{
                    res.json({status:200,message:'done'});
                }).catch(err=>{
                    res.json({status:404,message:'error in connection please try again'});
                })
            }).catch(err=>{
                res.json({status:404,message:'already follow'});
            })
        }).catch(err=>{
            console.log(err);
            res.json({status:404,message:err});
        })

    }else{
        console.log('missing data');
        res.json({status:404,message:'missing data'});
    }
};