const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');

let { isAuth } = require('../middlewares/authMiddleware');

const templatesManager = require('../managers/templatesManager');


router.get("/", async (req, res) => {
    let banners = await bannersManager.getAll();
    let templates = await templatesManager.getAll();

    console.log(templates);
    
    try {
        res.render('WPTemplates/templatesPage', {
            banners,
            showCarousel: true,
            templates
        })
        
    } catch (error) {
        console.log(error);
        
    }

});

router.get('/create', isAuth, (req, res) => {
    res.render('WPTemplates/createTemplate')
});

router.post('/create', isAuth, async (req, res) => {
    let data = req.body;

    try {
        await templatesManager.create(req.body);
        res.redirect('/templates')
    } catch (error) {
        res.render('templates/create', { error: getErrorMessage(err), ...bannerData });
    }
})





module.exports = router;