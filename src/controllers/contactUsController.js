const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const contactUsManager = require('../managers/contactUsManager');

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
        // Validate form data
        contactUsManager.validateFormData({ email, name, textMessage });

        // Verify reCAPTCHA (if needed)
        if (recaptchaToken) {
            await contactUsManager.verifyRecaptcha(recaptchaToken);
        }

        // Send the contact email
        await contactUsManager.sendContactEmail({ email, name, phone, textMessage });

        // Render success message
        res.render('contactUs', {
            message: 'Вашето съобщение е изпратено, благодарим. Ще се свържем с вас възможно най-скоро',
            messageClass: 'green',
            title: "Контакти и връзка с екипа | WebCreativeTeam"
        });

    } catch (error) {
        console.error('Error:', error);

        // Render error message
        res.status(400).render('contactUs', {
            message: 'Използване на забранени символи!',
            messageClass: 'red',
            name,
            email,
            phone,
            textMessage,
            title: "Контакти и връзка с екипа | WebCreativeTeam"
        });
    }
});


module.exports = router;
