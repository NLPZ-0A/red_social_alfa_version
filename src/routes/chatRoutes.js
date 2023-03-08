const router = require('express').Router();

//----------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const chatController =  require('../controller/chatController');
const keyController =  require('../controller/keyController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareAuth = require('../middlewares/isLoggedin');
const {cacheInit} = require('../middlewares/cache')


router.get('/', middlewareAuth.isLoggedIn, cacheInit, chatController.chatApp);
router.post('/responseChat/:id', middlewareAuth.isLoggedIn, chatController.responseChat);
router.post('/getKey/:id', middlewareAuth.isLoggedIn, keyController.getKey);

module.exports = router;