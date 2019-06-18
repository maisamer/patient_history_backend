var model = require('../Model/post');

// add post
exports.addPost = (req,res,next)=>{
    let username = req.body.username;
    let article = req.body.article;
    let date = new Date();
    if(article != null && article != undefined && username != null && username != undefined ){
        let item = {
            username:username,
            article:article,
            date : date
        };
        model.insertPost(item).then(success=>{
            res.json({status:200,message:'post added successfully',id:success});
        }).catch(err=>{
            res.json({status:404,message:'error in connection please try again'});
        })

    }else{
        res.json({status:404,message:'missing data'});
    }
};
exports.updatePost = (req,res,next)=> {
    let id = req.body.id;
    let description = req.body.article;
    console.log(id,description);
    if(id != null && id != undefined && description!= null && description != undefined) {
        model.updatePost(id, {article:description}).then(success => {
            res.json({status:200,message:'item updated successfully'});
        }).catch(err => {
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
}
exports.deletePost = (req,res,next)=> {
    let id = req.body.id;
    if(id != null && id != undefined ) {
        model.deletePost(id).then(success => {
            res.json({status:200,message:'item deleted successfully'});
        }).catch(err => {
            res.json({status:404,message:'error in connection please try again'});
        })
    }else{
        res.json({status:404,message:'missing data'});
    }
}
exports.getPosts = (req,res,next)=> {
    model.getPosts().then(success=>{
        res.json({status:200,posts:success});
    }).catch(err=>{
        res.json({status:404,message:'error in connection please try again'});
    })
}