require('dotenv').config();
const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const session = require('express-session');
const lusca = require('lusca');
const routes = require('./routes');

const { auth } = require('./middlewares/authMiddleware');
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');
const { DBLINK, PORT, SESSION_SECRET } = require('./config/config');

const app = express();

// Define Handlebars helpers
const hbsHelpers = {
    inc: function (value) {
        return parseInt(value) + 1;
    },
    eq: function (a, b) {
        return a === b;
    },
    includes: function (array, value) {
        return array && array.includes(value);
    },
    json: function (context) {
        return JSON.stringify(context);
    }
};

// Connect to the database
mongoose.connect(DBLINK)
    .then(() => console.log('DB connected!'))
    .catch((err) => console.log('DB Error: ', err.message));

// Set up Handlebars
app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: hbsHelpers
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

// Static files
app.use(express.static(path.resolve(__dirname, 'public')));

// Cookie parser
app.use(cookieParser());

// Session middleware
app.use(session({
    secret: SESSION_SECRET,
    resave: false,
    saveUninitialized: false, // Set to false in production
    cookie: {
        httpOnly: true,
        secure: false,      // Set to true in production with HTTPS
        sameSite: 'Lax',    // Consider 'Strict' in production
        maxAge: 2 * 24 * 60 * 60 * 1000 // 2 days
    }
}));

// Body parsing middleware
app.use(express.urlencoded({ extended: false }));

// Authentication middleware
app.use(auth);

// CSRF protection with lusca
app.use(lusca.csrf());

// Make the CSRF token available in templates
app.use((req, res, next) => {
    res.locals.csrfToken = req.lusca && req.lusca.csrfToken();
    next();
});

// Routes
app.use(routes);

// Error handling middleware for CSRF errors
app.use((err, req, res, next) => {
    if (err.code === 'EBADCSRFTOKEN') {
        // CSRF token validation failed
        res.status(403);
        res.render('error', { message: 'Invalid CSRF token' });
    } else {
        next(err);
    }
});

// Custom error handler
app.use(errorHandler);

// Start the server
const port = process.env.PORT || PORT || 3000;
app.listen(port, () => console.log(`Server is listening on port ${port}...`));
