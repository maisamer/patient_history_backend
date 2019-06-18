var model = require('../Model/family_Diseases');

exports.add = (req,res,next)=>{
    let username = req.body.username;
    let description = req.body.description;
    let name = req.body.name;
    let date = new Date();
    if(name != null && name != undefined && description != null && description != undefined && username != null && username != undefined ){
        let item = {
            description:description,
            name:name,
            date : date,
            username:username
        };
        model.insert(item).then(success=>{
            res.json({status:200,message:'disease added successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.update = (req,res,next)=> {
    let id = req.body.id;    let username = req.body.username;
    let description = req.body.description;
    let name = req.body.name;
    if(name != null && name != undefined && description != null && description != undefined && id != null && id != undefined ){
        let item = {
            description:description,
            name:name
        };
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
            res.json({status: 200, posts: success});
        }).catch(err => {
            res.json({status: 404, message: 'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
};