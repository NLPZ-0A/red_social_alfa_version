//------------------------------------------------------EXPRESS--------------------------------------------------------------------
const express = require('express');
const router = require('express').Router();
//-------------------------------------------------------MODELS--------------------------------------------------------------------
const user = require('../models/User');

//-------------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const userController = require('../controller/userController');
const profileController = require('../controller/profileController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareValidate = require('../middlewares/validations');
const middlewareAuth = require('../middlewares/isLoggedin');

router.post('/register', middlewareValidate.validatorRegister, userController.register);

router.get('/login',  (req, res) =>{
    if(req.cookies.login){
        res.redirect('/home')
    }
    
    return res.render('inputs', {title: 'welcome'});});

router.get('/', middlewareAuth.isLoggedIn);

router.post('/login', middlewareValidate.validatorLogin, userController.login); 

router.get('/logout', middlewareAuth.isLoggedIn, userController.logout);

router.get('/home', middlewareAuth.isLoggedIn, userController.home);

router.get('/profile/addProfile', middlewareAuth.isLoggedIn, profileController.addProfile);

router.get('/profile/:username',  middlewareAuth.isLoggedIn, profileController.profile);

router.post('/follow/:username', middlewareAuth.isLoggedIn, profileController.follow)

router.post('/unfollow/:username', middlewareAuth.isLoggedIn, profileController.unfollow)

router.get('/config',  async (req, res) => {

    return res.render('configuracion', {title: 'configuracion'});
});


module.exports = router;