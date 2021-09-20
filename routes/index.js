var express = require('express');
var router = express.Router();
const Book = require('../models').Book;

/* GET home page. */
router.get('/', (req, res, next) => {
  res.redirect('/books');
  //const books = await Book.findAll();
  //console.log(books);
  //res.json({ books: books });
});

module.exports = router;
