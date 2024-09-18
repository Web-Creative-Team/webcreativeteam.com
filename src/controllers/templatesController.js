const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');

let { isAuth } = require('../middlewares/authMiddleware');

const templatesManager = require('../managers/templatesManager');


router.get("/", async (req, res) => {
    let banners = await bannersManager.getAll();
    let templates = await templatesManager.getAll();

    try {
        res.render('WPTemplates/templatesPage', {
            banners,
            showCarousel: true,
            templates,
            title: 'Тест',
            description: 'Тест'
        })
        
    } catch (error) {
        console.log(error);
        
    }

});

router.get('/create', isAuth, (req, res) => {
    res.render('WPTemplates/createTemplate')
});

router.post('/create', isAuth, async (req, res) => {
    
    try {
        let data = req.body
        await templatesManager.create(data);
        res.redirect('/templates')
    } catch (error) {
        res.render('templates/create', { error: getErrorMessage(err), ...data });
    }
})

router.get('/edit', isAuth, async(req, res)=>{
    
    try {
        let templates = await templatesManager.getAll()
        res.render('WPTemplates/editTemplatesView', {
            templates
        })
    } catch (error) {
        console.log(error);
        
    }
})

router.get('/:templateId/edit', isAuth, async(req, res)=>{
    try {
        let templateId = req.params.templateId;
        let searchedTemplate = await templatesManager.getOne(templateId)     
        res.render('WPTemplates/editTemplateForm', searchedTemplate)
        
    } catch (error) {
        console.log(error);
        
    }
})

router.post('/:templateId/edit', isAuth, async(req, res)=>{
    let templateData = req.body;
    let templateId = req.params.templateId;

    try {
        let edited = await templatesManager.edit(templateId, templateData)
        res.redirect('/templates')
    } catch (error) {
        console.log(error);
        
    }
})

router.get('/:templateId/delete', async (req, res) => {
    if (!req.user) {
        res.redirect('/users/login')
    } else {
        try {
            let templateId = req.params.templateId;
            console.log(templateId);
            await templatesManager.delete(templateId);

            res.redirect("/templates/edit")

        } catch (error) {

        }
    }
})





module.exports = router;