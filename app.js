require('dotenv').config();
const express = require('express');
const app = express();
const hbs = require('hbs');
const logger = require('morgan');
const bodyParser = require('body-parser')

// connect to database:
require('./db/index');

app.set('views', __dirname + '/views');
app.set('view engine', 'hbs');
app.use(express.static(__dirname + '/public'))
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: true }));



// Routes here:

const indexRoutes = require('./routes/index.routes');
app.use('/', indexRoutes);
const movieRoutes = require('./routes/movie.routes');
app.use('/', movieRoutes);


// middleware runs whenever the requested page is not available
app.use((req, res, next) => {
    res.status(404).render('not-found.hbs')
})

// whenever you call next(err), this middleware will handle the error.always logs the error
app.use((err, req, res, next) => {
    console.error('middleware Error', req.method, req.path, err)

    if (!res.headersSent) {
        res.status(500).render('error.hbs')
    }
})

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));