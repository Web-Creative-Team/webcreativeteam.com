const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');
const articleManager = require('../managers/articlesManager');

const { isAuth } = require('../middlewares/authMiddleware');

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
        dateCreated: formatDate(new Date())
    };
    try {
        await articleManager.create(articleData);
        res.redirect('/articles');
    } catch (error) {
        console.error('Failed to create article:', error);
        res.render('articles/create', { error: 'Error creating article', ...articleData });
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

    try {
        let articleId = req.params.articleId;
        let articleData = req.body;
        await articleManager.edit(articleId, articleData);
        res.redirect(`/articles/${articleId}/details`);
    } catch (error) {
        console.error(error);
        res.status(500).send('Error deleting article');
        
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


