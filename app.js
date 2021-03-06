var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const models = require('./models');

//Requires the route files
const routes = require('./routes/index');
const books = require('./routes/books')

const app = express();

(async () => {
  await models.sequelize.sync();
  try {
    await models.sequelize.authenticate();
    console.log('Connection to the database successful!');
  } catch (error) {
    console.error('Error connecting to the database: ', error);
  }
})();

//Serve static files
app.use('/static', express.static('public'));

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/books', books);

//Catch 404 and forward to error handler
app.use(function(req, res, next) {
  const err = new Error();
  err.status = 404;
  err.message = 'Looks like this does not exist.';
  console.log(`There has been a ${err.status} error`);
  next(err);
});

//Global error handler
app.use(function(err, req, res, next) {
  if (err.status === 404) {
      console.log(`There has been a ${err.status} error`);
      res.render('page-not-found', { err });
  } else {
      err.message = err.message || `There has been a server error.`;
      console.log(`There has been a ${err.status} error`);
      res.status(err.status || 500).render('page-not-found', { err });
  }
});

module.exports = app;
