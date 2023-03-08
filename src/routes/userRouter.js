//------------------------------------------------------EXPRESS--------------------------------------------------------------------
const router = require('express').Router();

//-------------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const userController = require('../controller/userController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareValidate = require('../middlewares/validations');
const middlewareAuth = require('../middlewares/isLoggedin');
const {cacheInit} = require('../middlewares/cache');


router.post('/register', middlewareValidate.validatorRegister, userController.register);

router.get('/login',  (req, res) =>{
    if(req.cookies.login){
        res.redirect('/home')
    }
    
    return res.render('login', {title: 'welcome', layout : false});
});

router.get('/register',  (req, res) =>{
    if(req.cookies.login){
        res.redirect('/home')
    }
    
    return res.render('register', {title: 'welcome', layout : false});
});

router.get('/', middlewareAuth.isLoggedIn);

router.post('/login', middlewareValidate.validatorLogin, userController.login); 

router.get('/logout', middlewareAuth.isLoggedIn, userController.logout);

router.get('/home', middlewareAuth.isLoggedIn, cacheInit, userController.home);

router.get('/getCurrentUser', middlewareAuth.isLoggedIn, userController.getCurrentUser);


module.exports = router;