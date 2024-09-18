const nodemailer = require('nodemailer');
const axios = require('axios');
const { EMAIL, EMAIL_PASSWORD, EMAIL_SERVICE, CAPTCHA_SECRET_SITE_KEY } = require('../config/config');

// Set up the email transporter using nodemailer
const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});

// Validate email format
const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

// Validate form inputs
const validateFormData = ({ email, name, message }) => {
    if (!email || !name || !message) {
        throw new Error('Моля попълнете всички задължителни полета');
    }

    if (!validateEmail(email)) {
        throw new Error('Невалиден email');
    }

    if (name.length < 2) {
        throw new Error('Името е прекалено кратко');
    }

    if (message.length < 10) {
        throw new Error('Съобщението е прекалено кратко');
    }

    return true;  // If all validations pass, return true
};

// Function to verify reCAPTCHA token
const verifyRecaptcha = async (recaptchaToken) => {
    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
            params: {
                secret: CAPTCHA_SECRET_SITE_KEY, // reCAPTCHA secret key from config
                response: recaptchaToken,        // Token from client
            }
        });

        const { success } = response.data;
        if (!success) {
            throw new Error('Invalid reCAPTCHA token');
        }

        return true;  // Return true if reCAPTCHA is verified
    } catch (error) {
        console.error('reCAPTCHA verification failed:', error.message);
        throw new Error('Failed to verify reCAPTCHA');
    }
};

// Send email function
const sendContactEmail = async ({ email, name, phone, message }) => {
    const mailOptions = {
        from: email, // Sender's email
        to: 'info@webcreativeteam.com', // Replace with your desired email recipient
        subject: `From Contact form - new Message from ${name}`,
        html: `<p>You have received a new message from the contact form:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);  // Send email using nodemailer
    } catch (error) {
        console.error('Failed to send email:', error);
        throw new Error('Failed to send email');
    }
};

module.exports = {
    validateEmail,
    validateFormData,
    verifyRecaptcha,
    sendContactEmail
};
