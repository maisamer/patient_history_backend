var express = require('express');
var router = express.Router();
var controller = require('../Controller/post');

router.post('/add',controller.addPost);
router.post('/update',controller.updatePost);
router.post('/delete',controller.deletePost);
router.post('/',controller.getPosts);
module.exports = router;