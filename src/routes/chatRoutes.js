const router = require('express').Router();

//----------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const chatController =  require('../controller/chatController')

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareAuth = require('../middlewares/isLoggedin');


router.get('/', middlewareAuth.isLoggedIn, chatController.chatApp);
router.post('/responseChat/:id', middlewareAuth.isLoggedIn, chatController.responseChat);

module.exports = router;