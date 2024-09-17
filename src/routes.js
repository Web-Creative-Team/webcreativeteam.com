const router = require('express').Router();
const homeController = require('./controllers/homeController');
const userController = require('./controllers/userController');
const servicesController = require('./controllers/servicesController');
const bannersController = require('./controllers/bannersController');
const articleController = require('./controllers/articleController');
const ourTeamController = require('./controllers/ourTeamController');
const templatesController = require('./controllers/templatesController');

router.use(homeController);
router.use( '/users', userController);
router.use('/services', servicesController);
router.use('/banners', bannersController);
router.use('/articles', articleController);
router.use('/ourteam', ourTeamController);
router.use('/templates', templatesController);


router.get('*', (req, res)=>{
    res.redirect('/404')
});

module.exports = router;