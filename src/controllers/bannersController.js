// bannersController.js
const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
let { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");

const upload = multer({ storage: multer.memoryStorage() });

router.get('/create', isAuth, (req, res) => {
    try {
        res.render('banners/createBanner', { title: "Create Banner" })
    } catch (error) {
        
        res.status(404).render('home', { error: getErrorMessage(err) });
    }
})

router.post("/create", isAuth, upload.single("bannerImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render("banners/createBanner", { error: "No file uploaded!" });
        }

        // ✅ Upload the image to pCloud
        const imageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, "banners");

        // ✅ Ensure **MongoDB record is created**
        const bannerData = {
            bannerImage: imageUrl,   // ✅ Store the direct file URL
            bannerTitle: req.body.bannerTitle,
            bannerSubtitle: req.body.bannerSubtitle
        };

        await bannersManager.create(bannerData);
        console.log("✅ Banner saved to database:", bannerData);

        res.redirect("/banners/edit");

    } catch (error) {
        console.error("❌ Banner creation failed:", error);
        res.render("banners/createBanner", { error: error.message });
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
console.log(searchedBanner);

        res.render('banners/editBannersForm', searchedBanner)

    } catch (error) {
        console.log(error);
    }
})

router.post('/:bannerId/edit', isAuth, upload.single("bannerImage"), async (req, res) => {
    try {
        let bannerId = req.params.bannerId;
        let bannerData = {
            bannerTitle: req.body.bannerTitle,
            bannerSubtitle: req.body.bannerSubtitle,
        };

        if (req.file) {
            console.log("✅ New image uploaded, replacing existing one...");
            const newImageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, "banners");
            bannerData.bannerImage = newImageUrl;
        } else {
            console.log("ℹ️ No new image uploaded, keeping the old one.");
        }

        await bannersManager.edit(bannerId, bannerData);
        console.log("✅ Banner updated:", bannerData);
        res.redirect('/banners/edit');
    } catch (error) {
        console.log("❌ Error updating banner:", error);
        res.render("banners/editBannersForm", { error: error.message });
    }
});

router.get('/:bannerId/delete', async (req, res) => {
    if (!req.user) {
        res.redirect('/users/login')
    } else {
        try {
            let bannerId = req.params.bannerId;
            await bannersManager.delete(bannerId);

            res.redirect("/banners/edit")

        } catch (error) {

        }
    }
})

module.exports = router;