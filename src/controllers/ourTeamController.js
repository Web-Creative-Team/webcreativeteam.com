const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('ourTeam/ourTeamMain', {title:"test", description: "test"})
})

router.get('/petya', (req, res)=>{
    res.render('ourTeam/petyaPage', {title:"test", description: "test"})
})

router.get('/stefan', (req, res)=>{
    res.render('ourTeam/stefanPage', {title:"test", description: "test"})
})




module.exports = router;
