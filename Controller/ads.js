var model = require('../Model/ads');
const fileConfigration = require('../Controller/fileConfigration');
const workspace = require('../Model/workspace');
exports.add = (req,res,next)=>{
    var username = req.body.username ;
    var file = req.file;
    var text = req.body.text;
    var date = new Date();
    if(file && username != null && username != undefined && text != null && text != undefined){
        workspace.search(username).then(success=>{
            fileConfigration.uploadFileToStorage(file).then(url=>{
                var item={
                    username:username,
                    file:url,
                    text:text,
                    date:date
                };
                model.insert(item).then(success=>{
                    res.json({status:200,message:'ad added successfully'});
                }).catch(err=>{
                    res.json({status:404,message:'error in connection please try again'});
                })
            }).catch(err=>{
                res.json({status:404,message:'error in uploading image'});
            })
        }).catch(err=>{
            res.json({status:404,message:'invalid username'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
