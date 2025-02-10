const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const templatesManager = require('../managers/templatesManager');
const bannersManager = require('../managers/bannersManager');

const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");
const { isValidImage } = require("../utils/fileValidator");  // ✅ Add this line

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
        let errors = {};

        if (!req.file) {
            errors.templateImage = "Моля изберете изображение!";
        } else {
            const isImageValid = await isValidImage(req.file);
            if (!isImageValid) {
                errors.templateImage = "Файлът е компрометиран и не може да бъде използван!";
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("WPTemplates/createTemplate", {
                error: Object.values(errors).join("<br>"),
                errors,
                templateAltAttribute: req.body.templateAltAttribute,
                templateTitle: req.body.templateTitle,
                templateShortDescription: req.body.templateShortDescription,
                previewLink: req.body.previewLink
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

        console.log("errorInfo: ", errorInfo);


        res.render("WPTemplates/createTemplate", {
            error: errorInfo.messages[errorInfo.messages.length - 1],
            errors: errorInfo.fields,
            templateAltAttribute: req.body.templateAltAttribute,
            templateTitle: req.body.templateTitle,
            templateShortDescription: req.body.templateShortDescription,
            previewLink: req.body.previewLink
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
    let templateId = req.params.templateId;
    let existingTemplate = await templatesManager.getOne(templateId);
    try {
        console.log(existingTemplate);
        
        if (!existingTemplate) {
            throw new Error("Template not found.");
        }

        let errors = {};

        if (req.file) {
            const isImageValid = await isValidImage(req.file);
            if (!isImageValid) {
                errors.templateImage = "Файлът е компрометиран и не може да бъде използван!";
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("WPTemplates/editTemplateForm", { 
                error: "Файлът е компрометиран и не може да бъде използван!",
                errors, 
                ...req.body, 
                templateImage: existingTemplate.templateImage // Keep old image
            });
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

        await templatesManager.edit(templateId, templateData);
        console.log("✅ Template updated:", templateData);
        res.redirect('/templates/edit');

    } catch (error) {
        console.error("❌ Template update failed:", error);

        const errorInfo = getErrorMessage(error);

        res.render("WPTemplates/editTemplateForm", {
            error: errorInfo.messages[errorInfo.messages.length - 1],
            errors: errorInfo.fields,
            templateAltAttribute: req.body.templateAltAttribute,
            templateTitle: req.body.templateTitle,
            templateShortDescription: req.body.templateShortDescription,
            previewLink: req.body.previewLink,
            templateImage: existingTemplate.templateImage // Keep image
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
