const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');


router.get('/website', async (req, res) => {
    let banners = await bannersManager.getAll();
    res.render('servicesViews/website', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Услуги за изработка на сайтове и онлайн магазини", 
        description: "Изработка на интернет сайт и онлайн магазини. Уеб сайт по шаблон. Индивидуални решения за вас. Сингъл и мултипейдж апликации" })
});

// router.get('/seo', async (req, res) => {
//     let banners = await bannersManager.getAll();

//     res.render('servicesViews/seo', { 
//             showSectionServices: true, 
//             banners: banners, 
//             title: "SEO оптимизация | Първи места в търсачките", 
//             description: "Оптимизация на уеб сайт. Първи места Гугъл класацията. Повишаване на посещаемостта на сайта ви" 
//         })
// });

router.get('/maintenance', async (req, res) => {
    let banners = await bannersManager.getAll();

    res.render('servicesViews/maintenance', { 
            showSectionServices: true, 
            banners: banners, 
            title: "SEO оптимизация | Първи места в търсачките", 
            description: "Оптимизация на уеб сайт. Първи места Гугъл класацията. Повишаване на посещаемостта на сайта ви" 
        })
});

// router.get('/social', async (req, res) => {
//     let banners = await bannersManager.getAll();

//     res.render('servicesViews/social', { 
//         showSectionServices: true, 
//         banners: banners, 
//         title: "Рекламиране в интернет | Google ads | Facebook реклама", 
//         description: "Digital marketing. Рекламиране с Google ads и Facebook. Присъствие в социалните мрежи" 
//     })
// });

router.get('/digitalmarketing', async (req, res) => {
    let banners = await bannersManager.getAll();

    res.render('servicesViews/digitalMarketing', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Дигитална агенция WebCreativeTeam. Увеличете бизнеса онлайн. Онлайн маркетинг решения", 
        description: "Увеличете продажбите си с експертен дигитален маркетинг! | SEO, Google Ads, Google Analytics, Facebook реклама, Email маркетинг и анализи за бизнес растеж. Оптимизиране на бизнеса! Увеличете трафика и продажбите!" 
    })
});

router.get('/design', async(req, res) => {
    let banners = await bannersManager.getAll();

    res.render('servicesViews/design', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Създаване и поддръжка на уеб сайтове", 
        description: "test" 
    })
});

module.exports = router;