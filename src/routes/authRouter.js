const router = require('express').Router();
const { ConfirmAccount } = require('../controller/userController');
const cookies = require("cookie-parser")

router.use(cookies());


router.get('/confirm/:token', ConfirmAccount);
router.get('/confirmacion',(req, res)=>{ res.render('confirm')});



module.exports = router;