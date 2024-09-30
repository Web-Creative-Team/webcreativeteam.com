const router = require('express').Router();
const { body, validationResult } = require('express-validator');
const userManager = require('../managers/userManager');
const { TOKEN_KEY } = require('../config/config');
const { getErrorMessage } = require('../utils/errorHelpers');
const { isAuth } = require('../middlewares/authMiddleware');

router.get('/login', (req, res) => {
    res.render('users/login', { csrfToken: req.csrfToken() });
});

router.post('/login',
    [
        body('username').trim().notEmpty(),
        body('password').notEmpty()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.render('users/login', {
                error: 'Моля въведете потребителско име и парола!', // Global error message
                csrfToken: req.csrfToken(),
                username: req.body.username,
            });
        }

        const { username, password } = req.body;

        try {
            const token = await userManager.login(username, password);

            res.cookie(TOKEN_KEY, token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 2 * 24 * 60 * 60 * 1000
            });

            res.redirect('/');

        } catch (err) {
            return res.render('users/login', {
                error: 'Невалидни данни!', // "Invalid data!"
                csrfToken: req.csrfToken(),
                username: req.body.username,
            });
        }
    }
);

router.get('/register', isAuth, (req, res) => {
    res.render('users/register', { csrfToken: req.csrfToken() });
});

router.post('/register',
    [
        body('username').trim().notEmpty(),
        body('email').trim().notEmpty(),
        body('password').notEmpty(),
        body('repeatPassword').notEmpty(),
        body('repeatPassword').custom((value, { req }) => {
            if (value !== req.body.password) {
                throw new Error('Паролите не съвпадат'); // "Passwords do not match"
            }
            return true;
        })
    ],
    async (req, res) => {
        const errors = validationResult(req);
        let emptyFields = [];
        let errorMessage = '';

        if (!errors.isEmpty()) {
            const errorArray = errors.array();
            emptyFields = errorArray
                .filter(error => error.msg === 'Invalid value' || error.msg === 'Невалидна стойност')
                .map(error => error.param);

            if (emptyFields.length > 0) {
                errorMessage = 'Моля попълнете всички полета'; // "Please fill in all fields"
            } else {
                // Handle other validation errors
                errorMessage = errorArray.map(error => error.msg).join('<br>');
            }

            return res.render('users/register', {
                error: errorMessage,
                csrfToken: req.csrfToken(),
                username: req.body.username,
                email: req.body.email,
                emptyFields: emptyFields,
            });
        }

        const { username, email, password } = req.body;

        try {
            const token = await userManager.register({ username, email, password });
            res.cookie(TOKEN_KEY, token, {
                httpOnly: true,
                secure: false,
                sameSite: 'Lax',
                maxAge: 2 * 24 * 60 * 60 * 1000
            });
            res.redirect('/');
        } catch (err) {
            const errorMessage = getErrorMessage(err);
            res.render('users/register', {
                error: errorMessage,
                csrfToken: req.csrfToken(),
                username: req.body.username,
                email: req.body.email,
            });
        }
    }
);

router.get('/logout', (req, res) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true,
        sameSite: 'Strict'
    });
    res.redirect('/');
});

module.exports = router;
