//------------------------------------------------------EXPRESS--------------------------------------------------------------------
const router = require('express').Router();

//-------------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const profileController = require('../controller/profileController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareAuth = require('../middlewares/isLoggedin');
const uploadImage = require('../middlewares/uploadImage');
const {cacheInit} = require('../middlewares/cache');


//router.get('/addProfile', middlewareAuth.isLoggedIn, profileController.addProfile);

router.get('/',  middlewareAuth.isLoggedIn, (req, res) =>{
    return res.redirect('/home');
});

router.post('/addProfile', middlewareAuth.isLoggedIn, profileController.addProfile);

router.post('/uploadProfileImage', middlewareAuth.isLoggedIn, uploadImage.upload, profileController.uploadProfilePhoto);

router.get('/:username',  middlewareAuth.isLoggedIn, cacheInit, profileController.profile);

router.post('/follow/:username', middlewareAuth.isLoggedIn, profileController.follow);

router.post('/unfollow/:username', middlewareAuth.isLoggedIn, profileController.unfollow);

module.exports = router;
