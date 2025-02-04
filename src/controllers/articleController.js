// articlesController.js
const multer = require("multer"); // For handling file uploads
const router = require('express').Router();
const articleManager = require('../managers/articlesManager');
const { isAuth } = require('../middlewares/authMiddleware');
const { getErrorMessage } = require('../utils/errorHelpers');
const { uploadFileToPCloud } = require("../managers/pClowdManager");

const upload = multer({ storage: multer.memoryStorage() });

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

router.get('/', async (req, res) => {
    try {
        let articles = await articleManager.getAllSorted(); // 🔥 Fetch sorted articles
        let index = articles.length - 1;
        let singleArticle = articles[index];
        res.render('articles/article', {
            showSectionServices: true,
            singleArticle,
            articles,
            title: singleArticle.articleTitle,
            description: singleArticle.articleMetaDescription,
            alt:singleArticle.articleAlt
        });
    } catch (error) {
        console.error('Error loading articles or banners:', error);
        res.status(500).send('Error loading page');
    }
});

// GET - Render create article page
// ✅ GET - Render article creation page
router.get('/create', isAuth, (req, res) => {
    res.render('articles/createArticle', { title: "Създаване на блог статия" });
});

// ✅ POST - Handle article creation with image upload
router.post("/create", isAuth, upload.single("articleImage"), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).render("articles/createArticle", { error: "No file uploaded!" });
        }

        const storageFolder = "blogimages";
        const imageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, storageFolder);

        const articleData = {
            articleTitle: req.body.articleTitle,
            articleImage: imageUrl,
            articleAlt: req.body.articleAlt, // ✅ Store Alt Text
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
        res.render("articles/createArticle", { error: error.message });
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
            title: singleArticle.articleTitle,
            description: singleArticle.articleMetaDescription,
            alt:singleArticle.articleAlt
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
        res.render('articles/editArticle', { ...articleData, title: "Редактиране на Блог статия" })

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
            articleAlt: req.body.articleAlt, // ✅ Store Alt Text
        };

        if (req.file) {
            console.log("✅ New image uploaded, replacing existing one...");
            const newImageUrl = await uploadFileToPCloud(req.file.buffer, req.file.originalname, "blogimages");
            articleData.articleImage = newImageUrl;
        } else {
            console.log("ℹ️ No new image uploaded, keeping the old one.");
        }

        await articleManager.edit(articleId, articleData);
        console.log("✅ Article updated:", articleData);
        res.redirect(`/articles/${articleId}/details`);

    } catch (error) {
        console.log("❌ Error updating article:", error);
        res.render("articles/editArticle", { error: error.message });
    }
});


router.get('/:articleId/delete', async(req, res)=>{
    if (!req.user) {
        res.redirect('/users/login')
    } else{
    try {
        let articleId = req.params.articleId;
        await articleManager.delete(articleId);
        res.redirect('/articles');
        
    } catch (error) {

        //TODO: redirect doesn`t work properly!
        console.error('Error:', error);
        res.redirect(`/articles/${articleId}/details`, { error: 'Unsuccessful deletion' })

    }}
})


module.exports = router;


