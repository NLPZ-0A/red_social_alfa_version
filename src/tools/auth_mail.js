const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

const sendConfirmation = (user) => {

    let transporter = nodemailer.createTransport({

        host: process.env.MAIL_HOST,
        port:  process.env.MAIL_PORT,
        tls:{rejectUnauthorized: false},
        secure: false,
        auth: {
            user: process.env.MAIL_USERNAME,
            pass: process.env.MAIL_PASSWORD,
        }
    });

    const token = jwt.sign({email: user.email}, process.env.JWT_SECRET);
    
    console.log(`mail enviado a ${user.email}`);

    const urlConfirm = `${process.env.APIGATEWAY_URL}/auth/confirm/${token}`;

    return transporter.sendMail({
        from: user.email,
        to: process.env.MAIL_ADMIN_ADRESS,
        subject: "Please confirm your email!",
        html: `<p>Confirm your email <a href="${urlConfirm}">Confirm</p>`
    });

    
};

module.exports = {sendConfirmation};