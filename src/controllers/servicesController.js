const router = require('express').Router();
const bannersManager = require('../managers/bannersManager');


router.get('/website', async (req, res) => {
    let banners = await bannersManager.getAll();
    res.render('servicesViews/website', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Услуги за изработка на сайтове и онлайн магазини", 
        description: "Изработка на интернет сайт и онлайн магазини. Уеб сайт по шаблон. Индивидуални решения за вас. Сингъл и мултипейдж апликации",
        currentPage: "website",
        parentPage: "services"
    });
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
        title: "Поддръжка на сайт и онлайн магазин | WebCreativeTeam", 
        description: "Професионална поддръжка на сайт и онлайн магазин – сигурност, бързина и актуализации. Доверете се на WebCreativeTeam за безупречна работа на вашия бизнес!",
        currentPage: "maintenance",
        parentPage: "services"
    });
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
        title: "Дигитален маркетинг – SEO, реклама и стратегия за успех", 
        description: "Увеличете продажбите си с експертен дигитален маркетинг! SEO, Google Ads, Facebook реклама, имейл маркетинг и анализи за повече трафик и растеж.",
        currentPage: "digitalmarketing",
        parentPage: "services"
    });
});

router.get('/design', async(req, res) => {
    let banners = await bannersManager.getAll();
    res.render('servicesViews/design', { 
        showSectionServices: true, 
        banners: banners, 
        title: "Създаване и поддръжка на уеб сайтове", 
        description: "test",
        currentPage: "design",
        parentPage: "services"
    });
});

module.exports = router;