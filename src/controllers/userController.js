const router = require('express').Router();
const userManager = require('../managers/userManager');
const { TOKEN_KEY } = require('../config/config');
const { getErrorMessage } = require('../utils/errorHelpers');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
    res.render('users/login')
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body

    try {
        const token = await userManager.login(username, password);

        res.cookie(TOKEN_KEY, token, {
            httpOnly: true,
            secure: true,       // Set to true if using HTTPS
            sameSite: 'Strict', // Helps protect against CSRF
            maxAge: 2 * 24 * 60 * 60 * 1000 // Token expires in 2 days
          });

        res.redirect('/');

    } catch (err) {
        res.render('/users/login', { error: getErrorMessage(err) });
    }
});

router.get('/register', isAuth, (req, res) => {
    res.render('users/register')
});

router.post('/register', async (req, res) => {
    const { username, email, password, repeatPassword } = req.body;

    if (password !== repeatPassword) {
        return res.render('users/register', {
            error: "Passwords do not match",
            username,
            email
        });
    }

    try {
        const token = await userManager.register({ username, email, password, repeatPassword });
        res.cookie(TOKEN_KEY, token, {
            httpOnly: true,
            secure: true,       // Set to true if using HTTPS
            sameSite: 'Strict', // Helps protect against CSRF
            maxAge: 2 * 24 * 60 * 60 * 1000 // Token expires in 2 days
        });
        res.redirect('/');

    } catch (err) {
        res.render('users/register', { error: getErrorMessage(err), username, email });
        next(err);
    }

});

router.get('/logout', (req, res) => {
    res.clearCookie('token',  {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
      });

    res.redirect('/');
})

module.exports = router;