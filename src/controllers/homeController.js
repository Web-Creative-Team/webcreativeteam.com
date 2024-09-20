const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const { CAPTCHA_SITE_KEY } = require('../config/config');

router.get('/', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();
        
        // Render the home page with banners
        res.render('home', {
            showSectionServices: true,
            showCarousel: true,
            banners,  // Pass banners directly
            title: "Интернет агенция | Изработка уебсайт | WebCreativeTeam",
            description: "Изработка на уебсайт...",
            recaptchaSiteKey: CAPTCHA_SITE_KEY,
        });
    } catch (error) {
        console.error('Error in home route:', error.message);  // Log error message

        // Render home page with error notification
        res.render('home', {
            message: 'Възникна грешка при зареждане на началната страница.',
            messageClass: 'red',
            showSectionServices: true,
            showCarousel: true,
            title: "Интернет агенция | Изработка уебсайт | WebCreativeTeam",
            description: "Изработка на уебсайт...",
            recaptchaSiteKey: CAPTCHA_SITE_KEY,
        });
    }
});

router.get('/prices', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();

        // Render prices page with banners
        res.render('prices', {
            title: "Цени и промоции на уебсайт...",
            description: "Цялостни решения за изработване...",
            banners,  // Pass banners directly
            showCarousel: true,
        });
    } catch (error) {
        console.error('Error in prices route:', error.message);  // Log error message

        // Render prices page with error notification
        res.render('prices', {
            message: 'Възникна грешка при зареждане на страницата с цени.',
            messageClass: 'red',
            title: "Цени и промоции на уебсайт...",
            description: "Цялостни решения за изработване...",
            showCarousel: true,
        });
    }
});

// If no matching route is found, show the 404 page
router.get('/404', (req, res) => {
    res.render('404', {
        title: "Страницата не е намерена",
        message: "Извинявайте, не можем да намерим страницата, която търсите.",
        messageClass: 'red'
    });
});



module.exports = router;
