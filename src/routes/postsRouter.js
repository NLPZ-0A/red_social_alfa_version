const express = require('express');
const router = require('express').Router();
const middlewareAuth = require('../middlewares/isLoggedin');
const fileController =  require('../middlewares/uploadImage');
const postController = require('../controller/postController');


router.post('/addPost', middlewareAuth.isLoggedIn, fileController.upload, postController.createPost);

router.post('/deletePost/:id', middlewareAuth.isLoggedIn, postController.deletePost);

router.post('/editPost/:post_id', middlewareAuth.isLoggedIn, fileController.upload, postController.editPost);

router.get('/send_post/', middlewareAuth.isLoggedIn, (req, res)=>{return res.render('send_post');});

router.post('/like/:post_id', middlewareAuth.isLoggedIn, postController.addLike);

router.post('/unlike/:post_id', middlewareAuth.isLoggedIn, postController.removeLike);

module.exports = router;