const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
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
        next(error);
    }
});

router.get('/prices', async (req, res, next) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('prices', {
            title: "Цени и промоции на уебсайт...",
            description: "Цялостни решения за изработване...",
            banners,
            showCarousel: true,
        });
    } catch (error) {
        next(error);
    }
});

router.get('/404', (req, res)=>{
    res.render('404')
})

module.exports = router;
