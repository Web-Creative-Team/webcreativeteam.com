const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const contactUsManager = require('../managers/contactUsManager');
const { CAPTCHA_SITE_KEY } = require('../config/config');

// Render the contact page
router.get('/contacts', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('contactUs', {
            showCarousel: true,
            banners,
            title: "Контакти и връзка с екипа | WebCreativeTeam",
            description: "За повече информация, контакти и връзка с екипа на WebCreativeTeam"
        });
    } catch (error) {
        next(error);
    }
});

// Handle form submission for the contact page
router.post('/contacts', async (req, res, next) => {
    const { email, name, phone, textMessage, recaptchaToken } = req.body;

    try {
        console.log('Validating form data...');
        // Validate form data
        contactUsManager.validateFormData({ email, name, textMessage });

        // Verify reCAPTCHA (if needed)
        if (recaptchaToken) {
            console.log('Verifying reCAPTCHA...');
            await contactUsManager.verifyRecaptcha(recaptchaToken);
        }

        // Send the contact email
        console.log('Sending email...');
        await contactUsManager.sendContactEmail({ email, name, phone, textMessage });

        // Render success message
        res.render('contactUs', {
            message: 'Вашето съобщение е изпратено, благодарим. Ще се свържем с вас възможно най-скоро.',
            messageClass: 'green',
            title: "Контакти и връзка с екипа | WebCreativeTeam"
        });

    } catch (error) {
        console.error('Error occurred:', error.message);
        console.log('Problematic field:', error.field);

        // Pass back the form data along with the error field and a generic error message
        res.status(400).render('contactUs', {
            message: 'Некоректно попълнена форма',  // Global error message
            messageClass: 'red',   // Set the red styling for error
            focusField: error.field,  // Focus on the problematic field
            name,
            email,
            phone,
            textMessage, // Retain the user's input
            title: "Контакти и връзка с екипа | WebCreativeTeam"
        });
    }
});





module.exports = router;
