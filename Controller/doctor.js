var model = require('../Model/doctor');
var mail = require('../Controller/Email');
exports.add = (req,res,next)=>{
    var username =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    let name = req.body.name;
    let email = req.body.email;
    let phone = req.body.phone;
    let major = req.body.major;
    let licenceNumber = req.body.licenceNumber;
    let experienceYear = req.body.experienceYear;
    let rate = 0;
    let posRate = 0;
    let negRate = 0;
    let globalId = Math.random().toString(36).substring(7);
    var passsword =`${Math.random().toString(36).substring(7)}_${Date.now()}`;
    if(experienceYear != null && experienceYear != undefined &&name != null && name != undefined && email != null && email != undefined && phone != null && phone != undefined && major != null && major != undefined && licenceNumber != null && licenceNumber != undefined){
        let item ={
            globalId:globalId,
            posRate:posRate,
            negRate:negRate,
            rate:rate,
            name:name,
            email:email,
            phone:phone,
            major:major,
            licenceNumber:licenceNumber,
            experienceYear:experienceYear,
            username:username,
            passsword:passsword
        };
        mail.registrationMailPlace(email,username,passsword).then(sucess=>{
            model.insert(item).then(ref=>{
                res.json({status: 200, message: 'user added successfully check your inbox'});
            }).catch(err=>{
                res.json({status: 404, message: 'error in connection please try again'});
            })
        }).catch(err=>{
            res.json({status: 404, message: 'invalid mail'});
        })

    }else{
        res.json({status: 404, message: 'missing data'});
    }


};
exports.login = (req,res,next)=>{
    let username = req.body.username;
    let password = req.body.passsword;
    if(username != null && username != undefined && password != null && password != undefined) {
        model.get(username,password).then(sucess=>{
            res.json({status: 200, user : sucess});
        }).catch(err=>{
            res.json({status: 404, message: err});
        })

    }else{
        res.json({status: 404, message: 'missing data'});
    }
};
exports.rate = (req,res,next)=>{
    let username = req.body.username;
    let rate = req.body.rate;
    if(username != null && username != undefined && rate != null && rate != undefined) {
        model.rate(username,rate).then(sucess=>{
            res.json({status: 200, message : sucess});
        }).catch(err=>{
            res.json({status: 404, message: err});
        })

    }else{
        res.json({status: 404, message: 'missing data'});
    }
};
// get doctor by globalId
exports.get = (req,res,next)=>{
    let id = req.body.id;
    if(id != null && id != undefined){
        model.getWithId(id).then(ref=>{
            res.json({status: 200, message: 'user found successfully',user:ref});
        }).catch(err=>{
            res.json({status: 404, message: 'error in connection please try again'});
        })
    }else{
        res.json({status: 404, message: 'missing data'});
    }
};
exports.delete = (req,res,next)=>{
  let username = req.body.username;
  if(username != null && username != undefined){
      model.delete(username).then(ref=>{
          res.json({status: 200, message: 'user deleted successfully'});
      }).catch(err=>{
          res.json({status: 404, message: 'error in connection please try again'});
      })
  }else{
      res.json({status: 404, message: 'missing data'});
  }
};
