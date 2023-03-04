//------------------------------------------------------EXPRESS--------------------------------------------------------------------
const router = require('express').Router();

//----------------------------------------------------CONTROLLERS--------------------------------------------------------------------
const notifications =  require('../controller/notificationsController');

//-------------------------------------------------------MIDLEWARES--------------------------------------------------------------------
const middlewareAuth = require('../middlewares/isLoggedin');

router.post('/getNotifications', middlewareAuth.isLoggedIn, notifications.getNotifications);
router.post('/viewNotification/:id', middlewareAuth.isLoggedIn, notifications.viewNotifications);


module.exports = router;