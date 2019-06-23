var model = require('../Model/family_Diseases');
exports.add = (req,res,next)=>{
    let username = req.body.username;
    let relatives = req.body.patientRelative;
    let name = req.body.diseaseName;
    let date = new Date();
    if(name != null && name != undefined && relatives != null && relatives != undefined && username != null && username != undefined ){
        let item = {
            relatives:relatives,
            name:name,
            date : date,
            username:username
        };
        model.insert(item).then(success=>{
            res.json({status:200,message:'item added successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.update = (req,res,next)=> {
    let id = req.body.id;
    let relatives = req.body.relatives;
    let name = req.body.name;
    let item = {
        relatives:relatives,
        name:name
    };
    if(name != null && name != undefined && relatives != null && relatives != undefined ){
        model.update(id,item ).then(success => {
            res.json({status:200,message:'item updated successfully'});
        }).catch(err => {
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
}
exports.delete = (req,res,next)=> {
    let id = req.body.id;
    if(id != null && id != undefined ) {
        model.delete(id).then(success => {
            res.json({status:200,message:'item deleted successfully'});
        }).catch(err => {
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.get = (req,res,next)=> {
    let username = req.body.username;
    if(username != null && username != undefined ) {
        model.get(username).then(success => {
            res.json({status: 200, family_diseases: success});
        }).catch(err => {
            res.json({status: 404, message: 'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};