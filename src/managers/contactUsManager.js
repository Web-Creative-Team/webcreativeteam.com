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
    email = sanitizeInput(email);
    name = sanitizeInput(name);
    textMessage = sanitizeInput(textMessage);
    phone = sanitizeInput(phone || ''); // Optional field

    // Check for forbidden symbols
    if (forbiddenPattern.test(email) || forbiddenPattern.test(name) || forbiddenPattern.test(textMessage) || (phone && forbiddenPattern.test(phone))) {
        const error = new Error('Използване на забранени символи!');
        error.field = 'global';
        throw error;
    }

    // Check for missing fields
    if (!email || !name || !textMessage) {
        const missingField = !email ? 'email' : !name ? 'name' : 'textMessage';
        const error = new Error('Некоректно попълнена форма');
        error.field = missingField;
        throw error;
    }

    // Validate email format
    if (!validateEmail(email)) {
        const error = new Error('Некоректно попълнена форма');
        error.field = 'email';
        throw error;
    }

    if (email.length > 255 || name.length > 50 || textMessage.length > 1000) {
        const error = new Error('Некоректно попълнена форма');
        const field = email.length > 255 ? 'email' : name.length > 50 ? 'name' : 'textMessage';
        error.field = field;
        throw error;
    }

    // Check for invalid name (e.g., no numbers or special characters)
    if (!validator.isAlpha(name.replace(/\s+/g, ''))) {  // Allow spaces but not numbers or special characters
        const error = new Error('Некоректно попълнена форма');
        error.field = 'name';
        throw error;
    }

    // Check for short name or message length
    if (name.length < 2 || textMessage.length < 10) {
        const error = new Error('Некоректно попълнена форма');
        const field = name.length < 2 ? 'name' : 'textMessage';
        error.field = field;
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
