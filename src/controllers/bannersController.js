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
        let errors = {};

        if (!req.file) {
            errors.bannerImage = "Моля изберете изображение!";
        }

        if (!req.body.bannerTitle?.trim()) {
            errors.bannerTitle = "Моля въведете слоган!";
        } else if (!/^[\p{L}0-9\s\-\.,!?%$&@]+$/u.test(req.body.bannerTitle)) {
            errors.bannerTitle = "Използване на забранени символи!";
        }

        if (!req.body.bannerSubtitle?.trim()) {
            errors.bannerSubtitle = "Моля въведете кратко изречение!";
        } else if (!/^[\p{L}0-9\s\-\.,!?%$&@]+$/u.test(req.body.bannerSubtitle)) {
            errors.bannerSubtitle = "Използване на забранени символи!";
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("banners/createBanner", { errors, ...req.body });
        }

        const storageFolder = "herobanner";
        const imageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder);

        const bannerData = {
            bannerImage: imageUrl,
            bannerTitle: req.body.bannerTitle,
            bannerSubtitle: req.body.bannerSubtitle,
            storageFolder: storageFolder
        };

        await bannersManager.create(bannerData);
        console.log("✅ Banner saved to database:", bannerData);

        res.redirect("/banners/edit");

    } catch (error) {
        console.error("❌ Banner creation failed:", error);
        res.render("banners/createBanner", { error: error.message, ...req.body });
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
    let bannerId = req.params.bannerId;
    let existingBanner; // Declare outside try block to be available in catch

    try {
        existingBanner = await bannersManager.getOne(bannerId); // Fetch existing banner

        if (!existingBanner) {
            throw new Error("Banner not found.");
        }

        let bannerData = {
            bannerTitle: req.body.bannerTitle,
            bannerSubtitle: req.body.bannerSubtitle,
        };

        if (req.file) {
            console.log("✅ New image uploaded, replacing existing one...");
            const storageFolder = existingBanner.storageFolder || "herobanner";
            const newImageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder);
            bannerData.bannerImage = newImageUrl;
        } else {
            console.log("ℹ️ No new image uploaded, keeping the old one.");
        }

        // ✅ Validate via Mongoose before saving
        await bannersManager.validateAndUpdate(bannerId, bannerData);

        console.log("✅ Banner updated:", bannerData);
        res.redirect('/banners/edit');

    } catch (error) {
        console.log("❌ Error updating banner:", error);

        const { messages, fields } = getErrorMessage(error); // ✅ Use errorHelper.js

        res.render("banners/editBannersForm", {
            errors: messages,
            invalidFields: fields,
            ...req.body,
            bannerImage: existingBanner ? existingBanner.bannerImage : "", // ✅ Ensures image is passed even on error
        });
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