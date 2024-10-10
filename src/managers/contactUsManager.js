// contactUsManager.js

const nodemailer = require('nodemailer');
const axios = require('axios');
const validator = require('validator');
const { EMAIL, EMAIL_PASSWORD, EMAIL_SERVICE, CAPTCHA_SECRET_SITE_KEY } = require('../config/config');

// Validate email format
const validateEmail = (email) => {
    return validator.isEmail(email);
};

// Sanitize form inputs to avoid XSS or malicious input
const sanitizeInput = (input) => {
    return validator.escape(input.trim()); // Remove unwanted characters and trim whitespace
};

const forbiddenPattern = /<\/?[a-z]+>|[<>\/\\]{2,}/i;

// Validate form inputs
const validateFormData = ({ email, name, textMessage, phone }) => {
    console.log('validateFormData called with:', { email, name, textMessage, phone });

    email = sanitizeInput(email);
    name = sanitizeInput(name);
    textMessage = sanitizeInput(textMessage);
    phone = sanitizeInput(phone || '');

    // Check for forbidden symbols
    if (forbiddenPattern.test(email) || forbiddenPattern.test(name) || forbiddenPattern.test(textMessage) || (phone && forbiddenPattern.test(phone))) {
        console.log('Forbidden symbols detected');
        const error = new Error('Използване на забранени символи!');
        error.field = 'global';
        throw error;
    }

    // Check for missing fields
    if (!email || !name || !textMessage) {
        console.log('Missing required fields');
        const missingField = !email ? 'email' : !name ? 'name' : 'textMessage';
        const error = new Error('Моля попълнете всички задължителни полета!');
        error.field = missingField;
        throw error;
    }

    // Other validation checks...

    console.log('Validation passed');
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

// Set up the email transporter using nodemailer
const transporter = nodemailer.createTransport({
    service: EMAIL_SERVICE,
    auth: {
        user: EMAIL,
        pass: EMAIL_PASSWORD
    }
});

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

// Export all functions
module.exports = {
    validateEmail,
    validateFormData,
    sanitizeInput,
    verifyRecaptcha,
    sendContactEmail // Ensure this function is correctly exported
};
