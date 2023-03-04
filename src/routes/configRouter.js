//------------------------------------------------------EXPRESS--------------------------------------------------------------------
const router = require('express').Router();

//----------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const configController =  require('../controller/configController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareAuth = require('../middlewares/isLoggedin');

router.get('/', middlewareAuth.isLoggedIn, async (req, res) => {
    return res.redirect('/config/myAccount');
});

router.get('/myAccount', middlewareAuth.isLoggedIn, configController.myAccount);

router.get('/editProfile', middlewareAuth.isLoggedIn, configController.editAccount);

module.exports = router;