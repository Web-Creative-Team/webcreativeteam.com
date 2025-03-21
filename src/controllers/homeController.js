const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const { transporter, verifyRecaptcha } = require('../managers/emailManager');
// const { CAPTCHA_SITE_KEY } = require('../config/config');
const CAPTCHA_SITE_KEY = process.env.CAPTCHA_SITE_KEY;

const { hasForbiddenChars } = require('../utils/validationHelpers')

router.get('/', async (req, res, next) => {
    let banners = await bannersManager.getAll();
    try {
        // Grab optional "notifyMessage" and "notifyClass" from the query string
        const { notifyMessage, notifyClass } = req.query;

        res.render('home', {
            showSectionServices: true,
            showCarousel: true,
            banners,
            title: "Изработка на сайт | Интернет агенция | WebCreativeTeam",
            description: "Цялостни решения за изработване на уебсайт и онлайн магазин. Изгодни цени, промоции и отстъпки. ",
            recaptchaSiteKey: CAPTCHA_SITE_KEY,

            // Pass them to the template
            notifyMessage,
            notifyClass,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/prices', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('prices', {
            title: "Цени и промоции на уебсайт | Уеб магазини | WebCreativeTeam",
            description: "Цялостни решения за изработване на уебсайт и онлайн магазин. Изгодни цени, промоции и отстъпки.",
            banners,
            showCarousel: true,
            showSectionServices: true,
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
            recaptchaSiteKey: process.env.CAPTCHA_SITE_KEY,
            title: "Контакти и връзка с екипа | WebCreativeTeam",
            description: "За повече информация, контакти и връзка с екипа на WebCreativeTeam"
        });
    } catch (error) {
        console.log(error);

    }
});

const validateEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
};

router.post('/contacts', async (req, res, next) => {
    const { email, name, phone, message, recaptchaToken } = req.body;

    // 1) Basic checks
    if (!email || !name || !message) {
        return res.status(400).render('contactUs', {
            error: 'Всички полета отбелязани със * са задължителни.',
            name,
            email,
            phone,
            message
        });
    }

    if (hasForbiddenChars(email) || hasForbiddenChars(name) || hasForbiddenChars(phone) || hasForbiddenChars(message)) {
        return res.status(400).render('contactUs', {
            error: 'Използване на забранени символи!',
            name,
            email,
            phone,
            message
        });
    }

    if (name.length < 2) {
        return res.status(400).render('contactUs', {
            error: 'Името трябва да съдържа поне 2 символа',
            name,
            email,
            phone,
            message
        });
    }

    if (message.length < 10) {
        return res.status(400).render('contactUs', {
            error: 'Съобщението трябва да съдържа поне 10 символа',
            name,
            email,
            phone,
            message
        });
    }

    if (!recaptchaToken) {
        return res.status(400).send("reCAPTCHA token is missing.");
    }
    
    try {
        const verified = await verifyRecaptcha(recaptchaToken);
        if (!verified) {
            return res.status(400).send("Failed reCAPTCHA verification.");
        }
    } catch (error) {
        console.error("reCAPTCHA validation error:", error);
        return res.status(500).send("Internal reCAPTCHA validation error.");
    }
    

    const mailOptions = {
        from: email,
        to: 'info@webcreativeteam.com',
        subject: `From Contact form - new Message from ${name}`,
        html: `
          <p>You have a new message from the contact form:</p>
          <p><strong>Name:</strong> ${name}</p>
          <p><strong>Email:</strong> ${email}</p>
          <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
          <p><strong>Message:</strong> ${message}</p>
        `
    };

    try {
        await transporter.sendMail(mailOptions);

        // SUCCESS -> Redirect to home page with success message in query
        return res.redirect('/?notifyMessage=Благодарим! Ще ви отговорим възможно най-бързо!&messageText=green');
    } catch (error) {
        // ERROR -> Rerender contactUs with red error
        // (We attach the user input so they don't lose what they typed)
        return res.render('contactUs', {
            error: 'Възникна грешка при изпращане на имейл. Опитайте отново.',
            name,
            email,
            phone,
            message,
        });
    }
});

module.exports = router;
