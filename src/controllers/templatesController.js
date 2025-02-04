const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const templatesManager = require('../managers/templatesManager');
const bannersManager = require('../managers/bannersManager');

const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");

const upload = multer({ storage: multer.memoryStorage() });

// ✅ GET - Render Templates Page
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

// ✅ GET - Render Create Template Page
router.get('/create', isAuth, (req, res) => {
    res.render('WPTemplates/createTemplate');
});

// ✅ POST - Handle Template Creation (Upload Image to pCloud + Save in DB)
router.post("/create", isAuth, upload.single("templateImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render("WPTemplates/createTemplate", { error: "No file uploaded!" });
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
        res.render("WPTemplates/createTemplate", { error: error.message });
    }
});

// ✅ GET - Render Edit Templates View
router.get('/edit', isAuth, async (req, res) => {
    try {
        let templates = await templatesManager.getAll();
        res.render('WPTemplates/editTemplatesView', { templates });
    } catch (error) {
        console.error("❌ Error loading templates for editing:", error);
    }
});

// ✅ GET - Render Edit Template Form
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


// ✅ POST - Handle Template Update (With or Without New Image)
router.post('/:templateId/edit', isAuth, upload.single("templateImage"), async (req, res) => {
    try {
        let templateId = req.params.templateId;
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
        }

        await templatesManager.edit(templateId, templateData);
        console.log("✅ Template updated:", templateData);
        res.redirect('/templates/edit');

    } catch (error) {
        console.error("❌ Error updating template:", error);
        res.render("WPTemplates/editTemplateForm", { error: error.message });
    }
});

// ✅ GET - Delete a Template (Soft Delete Confirmation)
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
