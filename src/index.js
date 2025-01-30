const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const routes = require('./routes');

const { auth } = require('./middlewares/authMiddleware')
const { errorHandler } = require('./middlewares/errorHandlerMiddleware');

const { DBLINK, PORT } = require('./config/config');

const app = express();

//TODO: change DB name
//GPT recommended:
// Use environment variables for sensitive data
// mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/webcreativeteam')
//     .then(() => console.log('DB connected!'))
//     .catch((err) => console.log('DB Error: ', err.message));


// Define Handlebars helpers
const hbsHelpers = {
    inc: function (value, options) {
        return parseInt(value) + 1;
    }
};

mongoose.connect(DBLINK)
    .then(() => console.log('DB connected!'))
    .catch((err) => console.log('DB Error: ', err.message));

app.engine('hbs', handlebars.engine({
    extname: 'hbs',
    helpers: hbsHelpers // passing the helpers to Handlebars
}));
app.set('view engine', 'hbs');
app.set('views', 'src/views');

// app.use(express.static('src/public'));
app.use(express.static(path.resolve(__dirname, 'public')));
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
// It`s very impotrtant authMiddleware to be after cookieParser;
app.use(auth)
app.use(routes);
// after routes!
app.use(errorHandler);



//TODO: GPT recommended:
// const port = process.env.PORT || PORT || 3000;
// app.listen(port, console.log(`Server is listening on port ${PORT}...`));

const port = process.env.PORT || PORT || 3000;
app.listen(port, console.log(`Server is listening on port ${port}...`));