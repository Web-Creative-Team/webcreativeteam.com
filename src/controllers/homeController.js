const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const transporter = require('../managers/emailManager');


const { hasForbiddenChars } = require('../utils/validationHelpers')

router.get('/', async (req, res, next) => {
    let banners = await bannersManager.getAll();
    try {
        const { notifyMessage, notifyClass } = req.query;

        res.render('home', {
            showSectionServices: true,
            showCarousel: true,
            banners,
            title: "Изработка на сайт | Интернет агенция | WebCreativeTeam",
            description: "Цялостни решения за изработване на уебсайт и онлайн магазин. Изгодни цени, промоции и отстъпки. ",
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
    const { email, name, phone, message } = req.body;

    console.log("📩 Получена заявка за контакт:");
    console.log("🔹 Name:", name);
    console.log("🔹 Email:", email);
    console.log("🔹 Phone:", phone || "Not provided");
    console.log("🔹 Message:", message);

    // 1) Basic checks
    if (!email || !name || !message) {
        console.log("❌ Грешка: Липсват задължителни полета.");
        return res.status(400).render('contactUs', {
            error: 'Всички полета отбелязани със * са задължителни.',
            name,
            email,
            phone,
            message
        });
    }

    if (hasForbiddenChars(email) || hasForbiddenChars(name) || hasForbiddenChars(phone) || hasForbiddenChars(message)) {
        console.log("❌ Грешка: Използване на забранени символи.");
        return res.status(400).render('contactUs', {
            error: 'Използване на забранени символи!',
            name,
            email,
            phone,
            message
        });
    }

    if (name.length < 2) {
        console.log("❌ Грешка: Името трябва да е поне 2 символа.");
        return res.status(400).render('contactUs', {
            error: 'Името трябва да съдържа поне 2 символа',
            name,
            email,
            phone,
            message
        });
    }

    if (message.length < 10) {
        console.log("❌ Грешка: Съобщението трябва да е поне 10 символа.");
        return res.status(400).render('contactUs', {
            error: 'Съобщението трябва да съдържа поне 10 символа',
            name,
            email,
            phone,
            message
        });
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
        console.log("📧 Опит за изпращане на имейл...");
        let info = await transporter.sendMail(mailOptions);
        console.log("✅ Имейл изпратен успешно:", info.messageId);

        // SUCCESS -> Redirect to home page with success message
        return res.redirect('/?notifyMessage=Благодарим! Ще ви отговорим възможно най-бързо!&messageText=green');
    } catch (error) {
        console.error("❌ Грешка при изпращане на имейл:", error);

        // ERROR -> Rerender contactUs with red error
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
