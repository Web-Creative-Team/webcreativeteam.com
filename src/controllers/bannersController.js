const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
let { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');


router.get('/create', isAuth, (req, res) => {
    try {
        res.render('banners/createBanner', { title: "Create Banner" })
    } catch (error) {
        res.status(404).render('home', { error: getErrorMessage(err) });
    }
})

router.post('/create', isAuth, async (req, res) => {
    const bannerData = req.body
    try {
        await bannersManager.create(req.body);
        res.redirect('/')
    } catch (error) {
        res.render('banners/create', { error: getErrorMessage(err), ...bannerData });

    }
})

router.get('/edit', isAuth, async (req, res) => {
    try {
        let banners = await bannersManager.getAll();
        res.render('banners/editBannersView', { banners })

    } catch (error) {
        console.log(error);
    }
})

router.get('/:bannerId/edit', isAuth, async (req, res) => {

    try {
        let bannerId = req.params.bannerId;
        let searchedBanner = await bannersManager.getOne(bannerId);

        res.render('banners/editBannersForm', searchedBanner)

    } catch (error) {
        console.log(error);
    }
})

router.post('/:bannerId/edit', isAuth, async (req, res) => {
    try {
        let bannerId = req.params.bannerId;
        let bannerData = req.body
        await bannersManager.edit(bannerId, bannerData);

        res.redirect('/banners/edit')
    } catch (error) {
        console.log(error);
    }
})

router.get('/:bannerId/delete', async (req, res) => {
    if (!req.user) {
        res.redirect('/users/login')
    } else {
        try {
            let bannerId = req.params.bannerId;
            console.log(bannerId);
            await bannersManager.delete(bannerId);

            res.redirect("/banners/edit")

        } catch (error) {

        }
    }
})







module.exports = router;