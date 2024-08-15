const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('ourTeam/ourTeamMain')
})

router.get('/petya', (req, res)=>{
    res.render('ourTeam/petyaPage')
})




module.exports = router;
