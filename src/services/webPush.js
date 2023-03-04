const webpush = require('web-push'); 

webpush.setVapidDetails(
    `mailto:${process.env.MAIL_ADMIN_ADRESS}`,
     process.env.PUBLIC_VAPID_KEY,
     process.env.PRIVATE_VAPID_KEY
);

module.exports = webpush;