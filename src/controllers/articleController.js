// articlesController.js
const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const { body, validationResult } = require('express-validator');

const articleManager = require('../managers/articlesManager');
const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");
const { isValidImage } = require("../utils/fileValidator");
const { articleValidationRules } = require('../utils/articleValidators');



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

router.post("/create", 
    isAuth, 
    upload.fields([{ name: "articleImage" }, { name: "articleThumbnailImage" }]), 
    articleValidationRules,  // Use the imported validation rules
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const extractedErrors = {};
            errors.array().forEach(err => {
                extractedErrors[err.param] = true;
            });

            return res.status(400).render("articles/createArticle", {
                error: errors.array().map(err => err.msg).join("<br>"),
                errors: extractedErrors,
                articleTitle: req.body.articleTitle,
                articleAlt: req.body.articleAlt,
                articleContent: req.body.articleContent, // Preserve user's input
                articleMetaTitle: req.body.articleMetaTitle,
                articleMetaDescription: req.body.articleMetaDescription
            });
            
        }

        try {
            const storageFolder = "blogimages";
            const imageUrl = await uploadFileToPCloud(req.files.articleImage[0].buffer, req.files.articleImage[0].originalname, storageFolder);
            const thumbnailUrl = await uploadFileToPCloud(req.files.articleThumbnailImage[0].buffer, req.files.articleThumbnailImage[0].originalname, storageFolder);

            const articleData = {
                articleTitle: req.body.articleTitle,
                articleImage: imageUrl,
                articleThumbnailImage: thumbnailUrl,
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

            res.render("articles/createArticle", {
                error: "Възникна грешка при създаването на статията. Опитайте отново.",
                articleTitle: req.body.articleTitle,
                articleAlt: req.body.articleAlt,
                articleContent: req.body.articleContent,
                articleMetaTitle: req.body.articleMetaTitle,
                articleMetaDescription: req.body.articleMetaDescription
            });
        }
    }
);



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
    let articleId = req.params.articleId;
    let articleData = await articleManager.getOne(articleId);
    articleData.dateCreated = formatDate(articleData.dateCreated);
    
    try {

        // 👉 Pass the raw HTML for preloading
        res.render('articles/editArticle', {
            ...articleData,
            articleId,
            articleContentRaw: articleData.articleContent,  // Pass as raw HTML
            title: "Редактиране на Блог статия"
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error loading article');
    }
});

router.post(
    '/:articleId/edit',
    isAuth,
    upload.fields([{ name: "articleImage" }, { name: "articleThumbnailImage" }]),
    articleValidationRules, // Reuse the same validation rules
    async (req, res) => {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            const extractedErrors = {};
            errors.array().forEach(err => {
                extractedErrors[err.param] = true;
            });

            return res.status(400).render("articles/editArticle", {
                error: errors.array().map(err => err.msg).join("<br>"),
                errors: extractedErrors,
                articleTitle: req.body.articleTitle,
                articleAlt: req.body.articleAlt,
                articleContent: req.body.articleContent,
                articleMetaTitle: req.body.articleMetaTitle,
                articleMetaDescription: req.body.articleMetaDescription
            });
        }

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
    }
);

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
