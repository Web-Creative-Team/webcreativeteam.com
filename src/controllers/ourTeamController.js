
const router = require('express').Router();

router.get('/', (req, res)=>{
    res.render('ourTeam/ourTeamMain', {title:"За нас, за екипа | WebCreativeTeam", description: "За нас. Кои сме ние? Екип от ентусиасти, който работим за WebCreativeTeam"})
})

router.get('/petya', (req, res)=>{
    res.render('ourTeam/petyaPage', {title:"За нас, за екипа | WebCreativeTeam", description: "За нас. Кои сме ние? Екип от ентусиасти, който работим за WebCreativeTeam"})
})

router.get('/stefan', (req, res)=>{
    res.render('ourTeam/stefanPage', {title:"За нас, за екипа | WebCreativeTeam", description: "За нас. Кои сме ние? Екип от ентусиасти, който работим за WebCreativeTeam"})
})




module.exports = router;
