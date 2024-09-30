const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
let { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { validateFormData } = require('../lib/validations');

// GET request for creating a banner
router.get('/create', isAuth, (req, res) => {
    try {
        res.render('banners/createBanner', { title: "Create Banner" });
    } catch (error) {
        res.status(404).render('home', { error: getErrorMessage(error) });
    }
});

// POST request for creating a banner
router.post('/create', isAuth, async (req, res) => {
    const bannerData = req.body;  // Initialize bannerData from the request body

    try {
        // Validate the banner form data
        validateFormData(bannerData, 'banner');

        await bannersManager.create(bannerData);
        res.redirect('/');
    } catch (error) {
        // Pass the errors to the template and ensure bannerData is available
        res.render('banners/createBanner', {
            error: error.message,
            messageClass: 'red',
            errors: error.fields || {},  // Ensure field-specific errors are passed
            ...bannerData  // Keep the entered data in the form
        });
    }
});

// GET request to show all banners for editing
router.get('/edit', isAuth, async (req, res) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('banners/editBannersView', { banners });
    } catch (error) {
        console.log(error);
    }
});

// GET request for editing a specific banner
router.get('/:bannerId/edit', isAuth, async (req, res) => {
    try {
        let bannerId = req.params.bannerId;
        let searchedBanner = await bannersManager.getOne(bannerId);
        res.render('banners/editBannersForm', searchedBanner);
    } catch (error) {
        console.log(error);
    }
});

// POST request for editing a specific banner
router.post('/:bannerId/edit', isAuth, async (req, res) => {
    const bannerData = req.body;  // Ensure bannerData is initialized

    try {
        // Validate the banner form data
        validateFormData(bannerData, 'banner');

        let bannerId = req.params.bannerId;
        await bannersManager.edit(bannerId, bannerData);
        res.redirect('/banners/edit');
    } catch (error) {
        console.log(error);
        res.render('banners/editBannersForm', {
            error: error.message,
            messageClass: 'red',
            errors: error.fields || {},  // Ensure field-specific errors are passed
            ...bannerData  // Retain the form data for user correction
        });
    }
});

// GET request for deleting a specific banner
router.get('/:bannerId/delete', isAuth, async (req, res) => {
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
