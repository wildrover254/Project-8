var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const routes = require('./routes/index');
const books = require('./routes/books')

const app = express();

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

// catch 404 and forward to error handler
app.use((req, res, next) => {
  const err = new Error();
  err.status = 404;
  err.message = 'No page here buddy.';
  console.log(`There has been a ${err.status} error`);
  res.render('error', { err });
});

app.use((err, req, res, next) => {
  if (err.status === 404) {
      console.log(`There has been a ${err.status} error`)
      res.status(404).render('page-not-found', { err });
  } else {
      err.message = err.message || `There has been a server error.`;
      console.log(`There has been a ${err.status} error`)
      res.status(err.status || 500).render('error', { err });
  }
});


module.exports = app;
