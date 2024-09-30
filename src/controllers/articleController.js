const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const articleManager = require('../managers/articlesManager');
const { isAuth } = require('../middlewares/authMiddleware');
const { validateFormData } = require('../lib/validations');

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

// Validation configuration for articles
const articleValidationConfig = {
    requiredFields: ['articleTitle', 'articleImage', 'articleContent', 'articleMetaTitle', 'articleMetaDescription'],
    fieldLimits: {
        articleTitle: { min: 2, max: 100 },
        articleImage: { min: 10, max: 255 },
        articleContent: { min: 10, max: 1000 },
        articleMetaTitle: { min: 2, max: 55 },
        articleMetaDescription: { min: 10, max: 136 }
    }
};

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('en-US', options);
}

router.get('/', async (req, res) => {
    try {
        let articles = await articleManager.getAll();
        let index = articles.length - 1;
        let singleArticle = articles[index];
        let title = singleArticle.articleMetaTitle;
        let description = singleArticle.articleMetaDescription
        
        res.render('articles/article', {
            showSectionServices: true,
            singleArticle,
            articles,
            title,
            description
        });
    } catch (error) {
        console.error('Error loading articles or banners:', error);
        res.status(500).send('Error loading page');
    }
});

router.get('/create', isAuth, (req, res) => {
    res.render('articles/createArticle', { title: "Създаване на блог статия" });
});

router.post('/create', isAuth, async (req, res) => {
    let articleData = {
        ...req.body,
        dateCreated: formatDate(new Date())  // Keep the date formatting as it was
    };

    try {
        validateFormData(articleData);  // Validate the form data
        await articleManager.create(articleData);
        res.redirect('/articles');
    } catch (error) {
        console.error('Failed to create article:', error);

        // Pass errors back to the template
        res.render('articles/createArticle', {
            messageContent: error.message,        // Global error message
            messageClass: 'red',                  // Styling for error
            errors: error.fields || {},           // Specific field errors
            ...articleData                       // Retain entered data in the form
        });
    }
});

router.get('/:articleId/details', async (req, res) => {
    try {
        let articles = await articleManager.getAll();
        let articleId = req.params.articleId.toString();
        let singleArticle = await articleManager.getOne(articleId);
        let title = singleArticle.articleMetaTitle;
        let description = singleArticle.articleMetaDescription
        singleArticle.dateCreated = formatDate(singleArticle.dateCreated); // Formatting the date for display
        res.render('articles/article', {
            showSectionServices: true,
            singleArticle,
            articles,
            title,
            description
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

        console.log(articleData);
        
        res.render('articles/editArticle', { ...articleData, title: "Редактиране на Блог статия" })

    } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Error loading article');
    }
});

router.post('/:articleId/edit', isAuth, async (req, res) => {
    const articleId = req.params.articleId;
    const articleData = req.body;

    try {
        // Validate form data before saving
        validateFormData(articleData);
        
        // If no validation errors, save the updated article
        await articleManager.edit(articleId, articleData);
        res.redirect(`/articles/${articleId}/details`);
    } catch (error) {
        console.error('Failed to edit article:', error);

        // Render the edit page with the error message and retain field values
        res.render('articles/editArticle', {
            messageContent: error.message,        // Global error message
            messageClass: 'red',                  // Styling for error
            errors: error.fields || {},           // Specific field errors
            ...articleData  // Retain the filled fields
        });
    }
});


router.get('/:articleId/delete', isAuth, async(req, res)=>{
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


