const router = require('express').Router();


router.get('/website', (req, res) => {
    res.render('servicesViews/website')
});

router.get('/seo', (req, res) => {
    res.render('servicesViews/seo')
});

router.get('/social', (req, res) => {
    res.render('servicesViews/social')
});

router.get('/design', (req, res) => {
    res.render('servicesViews/design')
});

module.exports = router;