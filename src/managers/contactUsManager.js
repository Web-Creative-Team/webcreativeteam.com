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
const validateFormData = ({ email, name, textMessage }) => {
    if (!email || !name || !textMessage) {
        const missingField = !email ? 'email' : !name ? 'name' : 'textMessage';
        const error = new Error('Некоректно попълнена форма');
        error.field = missingField;
        throw error;
    }

    if (!validateEmail(email)) {
        const error = new Error('Некоректно попълнена форма');
        error.field = 'email';
        throw error;
    }

    if (name.length < 2) {
        const error = new Error('Некоректно попълнена форма');
        error.field = 'name';
        throw error;
    }

    if (textMessage.length < 10) {
        const error = new Error('Некоректно попълнена форма');
        error.field = 'textMessage';
        throw error;
    }

    return true;  // If all validations pass, return true
};

// Function to verify reCAPTCHA token
const verifyRecaptcha = async (recaptchaToken) => {
    const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify`, null, {
        params: {
            secret: CAPTCHA_SECRET_SITE_KEY,
            response: recaptchaToken,
        }
    });

    if (!response.data.success) {
        throw new Error('Invalid reCAPTCHA token');
    }

    return true;
};

// Send email function
const sendContactEmail = async ({ email, name, phone, textMessage }) => {
    const mailOptions = {
        from: email,
        to: 'info@webcreativeteam.com',
        subject: `From Contact form - new Message from ${name}`,
        html: `<p>You have received a new message from the contact form:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
               <p><strong>Message:</strong> ${textMessage}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
    } catch (error) {
        throw new Error('Failed to send email');
    }
};

module.exports = {
    validateEmail,
    validateFormData,
    verifyRecaptcha,
    sendContactEmail
};
