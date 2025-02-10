const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");
const { isValidImage } = require("../utils/fileValidator");
const Banner = require('../models/Banner'); // ✅ Import the model

const upload = multer({ storage: multer.memoryStorage() });

router.get('/create', isAuth, (req, res) => {
    try {
        res.render('banners/createBanner', { title: "Create Banner" })
    } catch (error) {
        res.status(404).render('home', { error: getErrorMessage(error) });
    }
});

router.post("/create", isAuth, upload.single("bannerImage"), async (req, res) => {
    try {
        let errors = {};

        // ✅ Check if a file is uploaded
        if (!req.file) {
            errors.bannerImage = "Моля изберете изображение!";
        } else {
            // ✅ Validate the uploaded file
            const isImageValid = await isValidImage(req.file);
            if (!isImageValid) {
                errors.bannerImage = "Файлът е компрометиран и не може да бъде използван!";
            }
        }

        // ✅ If there are errors (including file errors), stop and show them
        if (Object.keys(errors).length > 0) {
            return res.status(400).render("banners/createBanner", { errors, ...req.body });
        }

        // ✅ Upload image if valid
        const storageFolder = "herobanner";
        const imageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder);

        // ✅ Prepare banner data before validation
        const bannerData = {
            bannerImage: imageUrl, // ✅ Assign the image URL before validation
            bannerTitle: req.body.bannerTitle,
            bannerSubtitle: req.body.bannerSubtitle,
            storageFolder: storageFolder,
        };

        // ✅ Validate using Mongoose
        let banner = new Banner(bannerData);
        const validationError = banner.validateSync();

        if (validationError) {
            Object.keys(validationError.errors).forEach((field) => {
                errors[field] = validationError.errors[field].message;
            });
        }

        // ✅ If validation fails, show errors
        if (Object.keys(errors).length > 0) {
            return res.status(400).render("banners/createBanner", { errors, ...req.body });
        }

        // ✅ Save banner to database
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
        res.render('banners/editBannersForm', searchedBanner);
    } catch (error) {
        console.log(error);
    }
});

router.post('/:bannerId/edit', isAuth, upload.single("bannerImage"), async (req, res) => {
    let bannerId = req.params.bannerId;
    let existingBanner;

    try {
        existingBanner = await bannersManager.getOne(bannerId); // Fetch existing banner

        if (!existingBanner) {
            throw new Error("Banner not found.");
        }

        let errors = {};

        // ✅ If a new file is uploaded, validate it
        if (req.file) {
            const isImageValid = await isValidImage(req.file);
            if (!isImageValid) {
                errors.bannerImage = "Файлът е компрометиран и не може да бъде използван!";
            }
        }

        // ✅ If there are validation errors, return them
        if (Object.keys(errors).length > 0) {
            return res.status(400).render("banners/editBannersForm", {
                errors,
                invalidFields: errors,
                ...req.body,
                bannerImage: existingBanner.bannerImage, // ✅ Keep old image if error
            });
        }

        // ✅ Prepare banner data before validation
        let bannerData = {
            bannerTitle: req.body.bannerTitle,
            bannerSubtitle: req.body.bannerSubtitle,
        };

        // ✅ If a valid image is uploaded, update it
        if (req.file) {
            console.log("✅ New image uploaded, replacing existing one...");
            const storageFolder = existingBanner.storageFolder || "herobanner";
            const newImageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder);
            bannerData.bannerImage = newImageUrl;
        } else {
            console.log("ℹ️ No new image uploaded, keeping the old one.");
        }

        // ✅ Validate using Mongoose
        let banner = new Banner({ ...existingBanner.toObject(), ...bannerData });
        const validationError = banner.validateSync();

        if (validationError) {
            Object.keys(validationError.errors).forEach((field) => {
                errors[field] = validationError.errors[field].message;
            });
        }

        // ✅ If validation fails, return errors
        if (Object.keys(errors).length > 0) {
            return res.status(400).render("banners/editBannersForm", {
                errors,
                invalidFields: errors,
                ...req.body,
                bannerImage: existingBanner.bannerImage, // ✅ Keep old image if error
            });
        }

        // ✅ Save the updated banner
        await bannersManager.edit(bannerId, bannerData);
        console.log("✅ Banner updated:", bannerData);

        res.redirect('/banners/edit');

    } catch (error) {
        console.log("❌ Error updating banner:", error);

        const { messages, fields } = getErrorMessage(error);

        res.render("banners/editBannersForm", {
            errors: messages,
            invalidFields: fields,
            ...req.body,
            bannerImage: existingBanner ? existingBanner.bannerImage : "", // ✅ Keep old image
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
            console.error("Error deleting banner:", error);
        }
    }
});

module.exports = router;
