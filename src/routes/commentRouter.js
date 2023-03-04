//------------------------------------------------------EXPRESS--------------------------------------------------------------------
const router = require('express').Router();

//----------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const commentController =  require('../controller/commentsController');
const fileController =  require('../middlewares/uploadImage');
const postController =  require('../controller/postController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareAuth = require('../middlewares/isLoggedin');


router.post('/addComments/:id', middlewareAuth.isLoggedIn, fileController.upload, commentController.addComment);

router.post('/removeComment/:id', middlewareAuth.isLoggedIn, commentController.deleteComment);

router.post('/likeComment/:id', middlewareAuth.isLoggedIn, postController.addLikeComments);

router.post('/removeLikeComment/:id', middlewareAuth.isLoggedIn, postController.removeLikeComments);


module.exports = router;