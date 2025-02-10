// articlesController.js
const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const articleManager = require('../managers/articlesManager');
const mongoose = require("mongoose");
const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");
const { isValidImage } = require("../utils/fileValidator");

const upload = multer({ storage: multer.memoryStorage() });

function formatDate(date) {
    if (!date || isNaN(new Date(date))) {
        return "Невалидна дата"; // Prevents crash, handles missing/invalid dates
    }

    return new Intl.DateTimeFormat('bg-BG', {
        day: '2-digit', month: 'long', year: 'numeric'
    }).format(new Date(date));
}

router.get('/', async (req, res) => {
    try {
        let articles = await articleManager.getAllSorted(); // 🔥 Fetch sorted articles
        let singleArticle = articles[0]; // ✅ Select the newest article
        singleArticle.dateCreated = formatDate(singleArticle.dateCreated);

        res.render('articles/article', {
            showSectionServices: true,
            singleArticle,
            articles,
            title: singleArticle.articleMetaTitle,
            description: singleArticle.articleMetaDescription,
            alt: singleArticle.articleAlt
        });
    } catch (error) {
        console.error('Error loading articles or banners:', error);
        res.status(500).send('Error loading page');
    }
});

router.get('/create', isAuth, (req, res) => {
    res.render('articles/createArticle', { title: "Създаване на блог статия" });
});

router.post("/create", isAuth, upload.single("articleImage"), async (req, res) => {
    try {
        let errors = {};

        if (!req.file) {
            errors.articleImage = true;
        } else {
            // ✅ Validate if the uploaded file is a real image
            const isImageValid = await isValidImage(req.file);
            if (!isImageValid) {
                errors.articleImage = true;
                return res.status(400).render("articles/createArticle", { 
                    error: "Изображението е компрометирано и не може да се използва!", 
                    errors,
                    articleTitle: req.body.articleTitle, 
                    articleAlt: req.body.articleAlt, 
                    articleContent: req.body.articleContent, 
                    articleMetaTitle: req.body.articleMetaTitle, 
                    articleMetaDescription: req.body.articleMetaDescription
                });
            }
        }

        const storageFolder = "blogimages";
        const imageUrl = req.file ? await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder) : null;

        const articleData = {
            articleTitle: req.body.articleTitle,
            articleImage: imageUrl,
            articleAlt: req.body.articleAlt,
            articleContent: req.body.articleContent,
            articleMetaTitle: req.body.articleMetaTitle,
            articleMetaDescription: req.body.articleMetaDescription,
            dateCreated: new Date().toISOString(),
        };

        await articleManager.create(articleData);
        console.log("✅ Article saved to database:", articleData);
        res.redirect("/articles");

    } catch (error) {
        console.error("❌ Article creation failed:", error);

        // ✅ Get detailed validation errors
        let validationErrors = getErrorMessage(error);

        res.render("articles/createArticle", { 
            error: validationErrors.messages.join("<br>"), 
            errors: validationErrors.fields, 
            articleTitle: req.body.articleTitle, 
            articleAlt: req.body.articleAlt, 
            articleContent: req.body.articleContent, 
            articleMetaTitle: req.body.articleMetaTitle, 
            articleMetaDescription: req.body.articleMetaDescription
        });
    }
});

router.get('/:articleId/details', async (req, res) => {
    try {
        let articles = await articleManager.getAllSorted();
        let articleId = req.params.articleId.toString();
        let singleArticle = await articleManager.getOne(articleId);
        singleArticle.dateCreated = formatDate(singleArticle.dateCreated); // Formatting the date for display

        res.render('articles/article', {
            showSectionServices: true,
            singleArticle,
            articles,
            title: singleArticle.articleMetaTitle,
            description: singleArticle.articleMetaDescription,
            alt: singleArticle.articleAlt
        });
    } catch (error) {
        console.error('Error loading article:', error);
        res.status(500).send('Error loading article');
    }
});

router.get('/:articleId/edit', isAuth, async (req, res) => {
    try {
        let articleId = req.params.articleId;
        let articleData = await articleManager.getOne(articleId);
        articleData.dateCreated = formatDate(articleData.dateCreated);

        res.render('articles/editArticle', { ...articleData, title: "Редактиране на Блог статия" });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error loading article');
    }
});

router.post('/:articleId/edit', isAuth, upload.single("articleImage"), async (req, res) => {
    try {
        let articleId = req.params.articleId;
        let articleData = {
            articleTitle: req.body.articleTitle,
            articleContent: req.body.articleContent,
            articleMetaTitle: req.body.articleMetaTitle,
            articleMetaDescription: req.body.articleMetaDescription,
            articleAlt: req.body.articleAlt,
        };

        if (req.file) {
            console.log("✅ New image uploaded, validating...");
            
            // ✅ Validate if the uploaded file is a real image
            const isImageValid = await isValidImage(req.file);
            if (!isImageValid) {
                return res.status(400).render("articles/editArticle", {
                    error: "Изображението е компрометирано и не може да се използва!",
                    errors: { articleImage: true },
                    ...req.body
                });
            }

            console.log("✅ Image is valid, replacing existing one...");
            const newImageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, "blogimages");
            articleData.articleImage = newImageUrl;
        } else {
            console.log("ℹ️ No new image uploaded, keeping the old one.");
        }

        await articleManager.edit(articleId, articleData, { runValidators: true });
        console.log("✅ Article updated:", articleData);
        res.redirect(`/articles/${articleId}/details`);

    } catch (error) {
        console.log("❌ Error updating article:", error);

        let errors = {};

        if (error instanceof mongoose.Error.ValidationError) {
            for (const field in error.errors) {
                let message = error.errors[field].message;

                if (message.includes("match")) {
                    errors[field] = "Използване на забранени символи!";
                } else {
                    errors[field] = message;  // Default Mongoose error
                }
            }
        } else {
            errors.general = error.message;
        }

        res.render("articles/editArticle", {
            ...req.body,
            errors,
        });
    }
});

router.get('/:articleId/delete', async (req, res) => {
    if (!req.user) {
        res.redirect('/users/login')
    } else {
        try {
            let articleId = req.params.articleId;
            await articleManager.delete(articleId);
            res.redirect('/articles');

        } catch (error) {
            console.error('Error:', error);
            res.redirect(`/articles/${articleId}/details`, { error: 'Unsuccessful deletion' });
        }
    }
});

module.exports = router;
