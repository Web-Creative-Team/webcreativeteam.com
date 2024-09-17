const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const transporter = require('../managers/emailManager'); // Adjust path as needed
const { CAPTCHA_SITE_KEY } = require('../config/config');

router.get('/', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('home', {
            showSectionServices: true,
            showCarousel: true,
            banners,
            title: "Интернет агенция | Изработка уебсайт | WebCreativeTeam",
            description: "Изработка на уебсайт...",
            recaptchaSiteKey: CAPTCHA_SITE_KEY
        });
    } catch (error) {
        next(error); // Pass the error to the error handler
    }
});

router.get('/prices', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('prices', {
            title: "Цени и промоции на уебсайт...",
            description: "Цялостни решения за изработване...",
            banners,
            showCarousel: true
        });
    } catch (error) {
        next(error);
    }
});

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

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

router.post('/contacts', async (req, res, next) => {
    const { email, name, phone, message, recaptchaToken } = req.body;

    if (!email || !name || !message) {
        return res.status(400).render('contactUs', {
            error: 'Missing required fields',
            name,
            email,
            phone,
            message
        });
    }

    if (!validateEmail(email)) {
        return res.status(400).send('Invalid email format');
    }

    if (name.length < 2) {
        return res.status(400).send('Name is too short');
    }

    if (message.length < 10) {
        return res.status(400).send('Message is too short');
    }

    if (recaptchaToken) {
        try {
            const verified = await verifyRecaptcha(recaptchaToken);
            if (!verified) {
                return res.status(400).send('Invalid reCAPTCHA token');
            }
        } catch (error) {
            return next(error);
        }
    }

    const mailOptions = {
        from: email, // Use your server email here, not the user email
        to: 'info@webcreativeteam.com',
        subject: `From Contact form - new Message from ${name}`,
        html: `<p>You have received a new message from the contact form:</p>
               <p><strong>Name:</strong> ${name}</p>
               <p><strong>Email:</strong> ${email}</p>
               <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
               <p><strong>Message:</strong> ${message}</p>`
    };

    try {
        await transporter.sendMail(mailOptions);
        res.redirect('/');
    } catch (error) {
        console.error('Failed to send email:', error);
        next(error); // Pass the error to the error handler
    }
});

module.exports = router;
