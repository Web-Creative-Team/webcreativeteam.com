const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');

router.get('/website', async (req, res) => {
    let banners = await bannersManager.getAll();
    res.render('servicesViews/website', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Създаване и поддръжка на уеб сайтове", 
        description: "test" })
});

router.get('/seo', async (req, res) => {
    let banners = await bannersManager.getAll();

    res.render('servicesViews/seo', { 
            showSectionServices: true, 
            banners: banners, 
            title: "Създаване и поддръжка на уеб сайтове", 
            description: "test" 
        })
});

router.get('/social', async (req, res) => {
    let banners = await bannersManager.getAll();

    res.render('servicesViews/social', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Създаване и поддръжка на уеб сайтове", 
        description: "test" 
    })
});

router.get('/design', async(req, res) => {
    let banners = await bannersManager.getAll();

    res.render('servicesViews/design', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Създаване и поддръжка на уеб сайтове", 
        description: "test" 
    })
});

module.exports = router;