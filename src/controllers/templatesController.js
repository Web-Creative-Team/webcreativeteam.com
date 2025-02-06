const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const templatesManager = require('../managers/templatesManager');
const bannersManager = require('../managers/bannersManager');

const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");

const upload = multer({ storage: multer.memoryStorage() });

router.get("/", async (req, res) => {
    try {
        let banners = await bannersManager.getAll();
        let templates = await templatesManager.getAll();

        res.render('WPTemplates/templatesPage', {
            banners,
            showCarousel: true,
            templates
        });
    } catch (error) {
        console.error("❌ Error loading templates:", error);
        res.status(500).send("Error loading templates");
    }
});

router.get('/create', isAuth, (req, res) => {
    res.render('WPTemplates/createTemplate');
});

router.post("/create", isAuth, upload.single("templateImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render("WPTemplates/createTemplate", { 
                error: "Моля изберете изображение!", 
                errors: { templateImage: true }, 
                ...req.body 
            });
        }

        const storageFolder = "templateimages";
        const imageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder);

        const templateData = {
            templateImage: imageUrl,
            templateAltAttribute: req.body.templateAltAttribute,
            templateTitle: req.body.templateTitle,
            templateShortDescription: req.body.templateShortDescription,
            previewLink: req.body.previewLink
        };

        await templatesManager.create(templateData);
        console.log("✅ Template saved to database:", templateData);
        res.redirect("/templates");

    } catch (error) {
        console.error("❌ Template creation failed:", error);

        const errorInfo = getErrorMessage(error);

        res.render("WPTemplates/createTemplate", {
            error: errorInfo.messages.join("\n"),
            errors: errorInfo.fields,
            ...req.body
        });
    }
});


router.get('/edit', isAuth, async (req, res) => {
    try {
        let templates = await templatesManager.getAll();
        res.render('WPTemplates/editTemplatesView', { templates });
    } catch (error) {
        console.error("❌ Error loading templates for editing:", error);
    }
});

router.get('/:templateId/edit', isAuth, async (req, res) => {
    try {
        let templateId = req.params.templateId;
        let searchedTemplate = await templatesManager.getOne(templateId);

        if (!searchedTemplate) {
            return res.status(404).send("Template not found!");
        }

        searchedTemplate = searchedTemplate.toObject(); // Convert Mongoose document to plain object

        res.render('WPTemplates/editTemplateForm', searchedTemplate);
    } catch (error) {
        console.error("Error loading template for editing:", error);
        res.status(500).send("Error loading template for editing");
    }
});

router.post('/:templateId/edit', isAuth, upload.single("templateImage"), async (req, res) => {
    try {
        let templateId = req.params.templateId;
        let existingTemplate = await templatesManager.getOne(templateId);

        if (!existingTemplate) {
            throw new Error("Template not found.");
        }

        let templateData = {
            templateAltAttribute: req.body.templateAltAttribute,
            templateTitle: req.body.templateTitle,
            templateShortDescription: req.body.templateShortDescription,
            previewLink: req.body.previewLink
        };

        if (req.file) {
            console.log("✅ New image uploaded, replacing existing one...");
            const newImageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, "templateimages");
            templateData.templateImage = newImageUrl;
        } else {
            console.log("ℹ️ No new image uploaded, keeping the old one.");
            templateData.templateImage = existingTemplate.templateImage;
        }

        // ✅ Force validation to run on update
        await templatesManager.edit(templateId, templateData);

        console.log("✅ Template updated:", templateData);
        res.redirect('/templates/edit');

    } catch (error) {
        console.error("❌ Error updating template:", error);

        const errorInfo = getErrorMessage(error);

        res.render("WPTemplates/editTemplateForm", {
            error: errorInfo.messages.join("\n"),
            errors: errorInfo.fields,
            ...req.body,
            templateImage: (await templatesManager.getOne(req.params.templateId)).templateImage // Keep image
        });
    }
});



router.get('/:templateId/delete', isAuth, async (req, res) => {
    try {
        let templateId = req.params.templateId;
        await templatesManager.delete(templateId);
        console.log(`✅ Template deleted: ${templateId}`);
        res.redirect("/templates/edit");
    } catch (error) {
        console.error("❌ Error deleting template:", error);
        res.status(500).send("Error deleting template");
    }
});


module.exports = router;
