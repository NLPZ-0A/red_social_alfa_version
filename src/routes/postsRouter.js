const router = require('express').Router();
const middlewareAuth = require('../middlewares/isLoggedin');
const fileController =  require('../middlewares/uploadImage');
const postController = require('../controller/postController');
const userController = require('../controller/userController');


router.post('/addPost', middlewareAuth.isLoggedIn, fileController.upload, postController.createPost);

router.post('/deletePost/:id', middlewareAuth.isLoggedIn, postController.deletePost);

router.post('/editPost/:post_id', middlewareAuth.isLoggedIn, fileController.upload, postController.editPost);

router.post('/replyPost/:post_id', middlewareAuth.isLoggedIn, postController.replyPost);

router.get('/:id', middlewareAuth.isLoggedIn,  userController.postView);

router.get('/send_post/', middlewareAuth.isLoggedIn, (req, res)=>{return res.render('send_post');});

router.post('/like/:post_id', middlewareAuth.isLoggedIn, postController.addLike);

router.post('/unlike/:post_id', middlewareAuth.isLoggedIn, postController.removeLike);

module.exports = router;