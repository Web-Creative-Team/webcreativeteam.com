const nodemailer = require('nodemailer');

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;

console.log("🔍 ENVIRONMENT VARIABLES:");
console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL_PASSWORD:", process.env.EMAIL_PASSWORD);
console.log("EMAIL_SERVICE:", process.env.EMAIL_SERVICE);
console.log("EMAIL CONFIG:", process.env.EMAIL, process.env.EMAIL_SERVICE);


const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});

module.exports = transporter;
