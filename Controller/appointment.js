var model = require('../Model/appointment');
/*
  addAppointment function take date , start (from), finish (to) time of clinic appointment and insert in database
 */
exports.addAppointment = (req,res,next)=>{
  let from = req.body.from;
  let username = req.body.username; // clinic username
  let to = req.body.to;
  let date = req.body.date;
  if(username != null && username!= undefined &&from != null && from != undefined && to != null && to != undefined && date != null && date != undefined ){
      var item={
          from:from,
          to:to,
          clinicUsername:username,
          date:date
      };
      model.insert(item).then(success=>{
          res.json({status:200,message:'appointment is added successfully',id:success});
      }).catch(err=>{
          res.json({status:404,message:err});
      })
  }else{
      res.json({status:404,message:'missing data'});
  }
};
/*
  updateAppointment function take date , start (from), finish (to) , appointment id and updated it in database
 */
exports.updateAppointment = (req,res,next)=>{
    let from = req.body.from;
    let id = req.body.id; // appointment id
    let to = req.body.to;
    let date = req.body.date;
    let now = new Date();
    if(id != null && id!= undefined &&from != null && from != undefined && to != null && to != undefined && date != null && date != undefined ){
        var item={
            from:from,
            to:to,
            date:date
        };
        model.update(id,item).then(success=>{
            res.json({status:200,message:success});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
/*
  getAllAppointment function take clinic username and get all its appointments from database
 */
exports.getAllAppointment=(req,res,next)=>{
    let username = req.body.username; // clinic username
    if(username != null && username != undefined){
        model.get(username).then(appointments=>{
            res.json({status:200,appointments:appointments});
        }).catch(err=>{
            res.json({status:404,message:err});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }

};
