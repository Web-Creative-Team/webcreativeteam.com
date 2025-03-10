const nodemailer = require('nodemailer');
const axios = require('axios');

const EMAIL = process.env.EMAIL;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_SERVICE = process.env.EMAIL_SERVICE;
const CAPTCHA_SECRET_SITE_KEY = process.env.CAPTCHA_SECRET_SITE_KEY;

const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});

/**
 * Verifies Google reCAPTCHA v3 token.
 * @param {string} token - The reCAPTCHA token from frontend.
 * @returns {Promise<boolean>} - True if verification is successful, otherwise false.
 */
async function verifyRecaptcha(token) {
    try {
        const response = await axios.post('https://www.google.com/recaptcha/api/siteverify', null, {
            params: {
                secret: CAPTCHA_SECRET_SITE_KEY,
                response: token,
            },
        });

        return response.data.success;
    } catch (error) {
        console.error('reCAPTCHA verification failed:', error);
        return false;
    }
}

module.exports = { transporter, verifyRecaptcha };
