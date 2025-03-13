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
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: `secret=${secretKey}&response=${token}`
    });

    const data = await response.json();

    // Логваме целия отговор за дебъгване (махни това на продъкшън)
    console.log("reCAPTCHA response:", data);

    // Позволени хостове за различните среди
    const allowedHostnames = [
        "localhost", // Локална среда
        "webcreativeteam-preview.onrender.com", // Preview деплой
        "webcreativeteam.com" // Продукция
    ];

    // Проверка дали токенът е валиден
    if (!data.success) {
        console.error("reCAPTCHA validation failed:", data["error-codes"]);
        return false;
    }

    // Проверка дали hostname е в списъка с позволени
    if (!allowedHostnames.includes(data.hostname)) {
        console.error("Invalid reCAPTCHA hostname:", data.hostname);
        return false;
    }

    // Проверка дали reCAPTCHA score е над 0.5
    if (data.score < 0.5) {
        console.error("Low reCAPTCHA score:", data.score);
        return false;
    }

    return true;
}



module.exports = {
    transporter,
    verifyRecaptcha
};
