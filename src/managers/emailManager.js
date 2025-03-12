const nodemailer = require('nodemailer');

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});



async function verifyRecaptcha(token) {
    const secretKey = process.env.CAPTCHA_SECRET_SITE_KEY;
    const response = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();
    return data.success; // true ако CAPTCHA е валидна
}

module.exports = {
    transporter,
    verifyRecaptcha
};
