const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');

const templatesManager = require('../managers/templatesManager');


router.get("/", async(req, res)=>{
    let banners = await bannersManager.getAll();

    res.render('WPTemplates/templatesPage', {
        banners,
        showCarousel:true
    })
});



module.exports = router;