const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');

router.get('/', async (req, res) => {
    let banners = await bannersManager.getAll();
    // console.log(banners);
    res.render('home', {
        showSectionServices: true,
        banners: banners,
        title: "Създаване и поддръжка на уеб сайтове",
        description: "test"
    });
});

router.get('/contacts', (req, res)=>{
    res.render('contactUs')
})

router.get('/404', (req, res) => {
    res.render('404', {
        showSectionServices: false,
        title: "Page not fownd",
        description: "test"
    })
});

module.exports = router;

