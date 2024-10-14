const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
let { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { validateFormData } = require('../lib/validations');

router.get('/create', isAuth, (req, res) => {
    try {
        res.render('banners/createBanner', { title: "Create Banner" });
    } catch (error) {
        res.status(404).render('home', { error: getErrorMessage(err) });
    }
});

router.post('/create', isAuth, async (req, res) => {
    const bannerData = req.body;

    try {
        // Validate the banner form data
        validateFormData(bannerData, 'banner');

        await bannersManager.create(bannerData);
        res.redirect('/');
    } catch (error) {
        // Pass the errors to the template
        res.render('banners/createBanner', {
            error: error.message,
            messageClass: 'red',
            errors: error.fields || {},  // Ensure field-specific errors are passed
            ...bannerData  // Keep the entered data in the form
        });
    }
});


router.get('/edit', isAuth, async (req, res) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('banners/editBannersView', { banners });
    } catch (error) {
        console.log(error);
    }
});

router.get('/:bannerId/edit', isAuth, async (req, res) => {
    try {
        let bannerId = req.params.bannerId;
        let searchedBanner = await bannersManager.getOne(bannerId);
        res.render('banners/editBannersForm', searchedBanner);
    } catch (error) {
        console.log(error);
    }
});

router.post('/:bannerId/edit', isAuth, async (req, res) => {
    try {
        let bannerId = req.params.bannerId;
        let bannerData = req.body;

        // Validate the banner form data for edit
        validateFormData(bannerData, 'banner');

        await bannersManager.edit(bannerId, bannerData);
        res.redirect('/banners/edit');
    } catch (error) {
        console.log(error);
        res.render('banners/editBannersForm', {
            error: error.message,
            messageClass: 'red',
            ...bannerData
        });
    }
});

router.get('/:bannerId/delete', async (req, res) => {
    if (!req.user) {
        res.redirect('/users/login');
    } else {
        try {
            let bannerId = req.params.bannerId;
            await bannersManager.delete(bannerId);
            res.redirect("/banners/edit");
        } catch (error) {
            console.log(error);
        }
    }
});

module.exports = router;
