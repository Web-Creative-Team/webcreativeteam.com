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
        res.status(404).render('404');
    }
});

router.get('/create', isAuth, (req, res) => {
    res.render('articles/createArticle', { title: "Създаване на блог статия" });
});

router.post("/create", isAuth, upload.fields([{ name: "articleImage" }, { name: "articleThumbnailImage" }]), async (req, res) => {
    try {
        let errors = {};

        // Validate Main Image
        if (!req.files.articleImage) {
            errors.articleImage = true;
        } else {
            const isImageValid = await isValidImage(req.files.articleImage[0]);
            if (!isImageValid) {
                errors.articleImage = true;
            }
        }

        // ✅ Validate Thumbnail Image
        if (!req.files.articleThumbnailImage) {
            errors.articleThumbnailImage = true;
        } else {
            const isThumbnailValid = await isValidImage(req.files.articleThumbnailImage[0]);
            if (!isThumbnailValid) {
                errors.articleThumbnailImage = true;
            }
        }

        if (Object.keys(errors).length > 0) {
            return res.status(400).render("articles/createArticle", {
                error: "Моля попълнете всички задължителни полета!",
                errors,
                articleTitle: req.body.articleTitle,
                articleAlt: req.body.articleAlt,
                articleContent: req.body.articleContent,
                articleMetaTitle: req.body.articleMetaTitle,
                articleMetaDescription: req.body.articleMetaDescription
            });
        }

        const storageFolder = "blogimages";
        const imageUrl = await uploadFileToPCloud(req.files.articleImage[0].buffer, req.files.articleImage[0].originalname, storageFolder);
        const thumbnailUrl = await uploadFileToPCloud(req.files.articleThumbnailImage[0].buffer, req.files.articleThumbnailImage[0].originalname, storageFolder);

        const articleData = {
            articleTitle: req.body.articleTitle,
            articleImage: imageUrl,
            articleThumbnailImage: thumbnailUrl,  // 🔥 Save Thumbnail URL
            articleAlt: req.body.articleAlt,
            articleContent: req.body.articleContent,
            articleMetaTitle: req.body.articleMetaTitle,
            articleMetaDescription: req.body.articleMetaDescription,
            dateCreated: new Date().toISOString(),
        };

        await articleManager.create(articleData);
        res.redirect("/articles");

    } catch (error) {
        console.error("❌ Article creation failed:", error);
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

router.post('/:articleId/edit', isAuth, upload.fields([{ name: "articleImage" }, { name: "articleThumbnailImage" }]), async (req, res) => {
    try {
        let articleId = req.params.articleId;
        let articleData = {
            articleTitle: req.body.articleTitle,
            articleContent: req.body.articleContent,
            articleMetaTitle: req.body.articleMetaTitle,
            articleMetaDescription: req.body.articleMetaDescription,
            articleAlt: req.body.articleAlt,
        };

        // ✅ Update Main Image
        if (req.files.articleImage) {
            const isImageValid = await isValidImage(req.files.articleImage[0]);
            if (!isImageValid) {
                return res.status(400).render("articles/editArticle", {
                    error: "Изображението е компрометирано и не може да се използва!",
                    errors: { articleImage: true },
                    ...req.body
                });
            }
            const newImageUrl = await uploadFileToPCloud(req.files.articleImage[0].buffer, req.files.articleImage[0].originalname, "blogimages");
            articleData.articleImage = newImageUrl;
        }

        // ✅ Update Thumbnail Image
        if (req.files.articleThumbnailImage) {
            const isThumbnailValid = await isValidImage(req.files.articleThumbnailImage[0]);
            if (!isThumbnailValid) {
                return res.status(400).render("articles/editArticle", {
                    error: "Миниатюрното изображение е компрометирано!",
                    errors: { articleThumbnailImage: true },
                    ...req.body
                });
            }
            const newThumbnailUrl = await uploadFileToPCloud(req.files.articleThumbnailImage[0].buffer, req.files.articleThumbnailImage[0].originalname, "blogimages");
            articleData.articleThumbnailImage = newThumbnailUrl;
        }

        await articleManager.edit(articleId, articleData, { runValidators: true });
        res.redirect(`/articles/${articleId}/details`);

    } catch (error) {
        console.error("❌ Error updating article:", error);

        let validationErrors = getErrorMessage(error);

        res.render("articles/editArticle", {
            ...req.body,
            errors: validationErrors.fields
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
