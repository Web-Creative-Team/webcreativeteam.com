const router = require('express').Router();
const userManager = require('../managers/userManager');
// const { TOKEN_KEY } = require('../config/config');
const TOKEN_KEY = process.env.TOKEN_KEY;
const { getErrorMessage } = require('../utils/errorHelpers');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const token = await userManager.login(username, password);

        res.cookie(TOKEN_KEY, token);

        res.redirect('/');

    } catch (err) {
        res.render('/users/login', { error: getErrorMessage(err) });
    }
});

router.get('/register', isAuth, (req, res) => {
    res.render('users/register')
});

// Register with username and password, and redirect to the Home  Page
router.post('/register', async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;
    console.log("controller: ", req.body);

    if (password !== repeatPassword) {
        return res.render('users/register', {
            error: "Passwords do not match",
            username,
            email
        });
    }

    try {
        const token = await userManager.register({ username, email, password, repeatPassword });
        // res.redirect('/users/login');

        // If we want to be logged in immediately after register
        res.cookie(TOKEN_KEY, token); 
        res.redirect('/');

    } catch (err) {
        console.log("Controller said - Error: ", err.message);
        
        res.render('users/register', { error: err.message, username, email });
        // next(err);
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('token');

    res.redirect('/');
})

module.exports = router;