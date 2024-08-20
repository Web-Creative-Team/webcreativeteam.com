const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('ourTeam/ourTeamMain', {title:"test", description: "test"})
})

router.get('/petya', (req, res)=>{
    res.render('ourTeam/petyaPage')
})

router.get('/stefan', (req, res)=>{
    res.render('ourTeam/stefanPage')
})




module.exports = router;
