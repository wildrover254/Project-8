const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

//Wrapper function for async operations
function asyncHandler(cb){
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch(error){
            next(error);
        }
    }
}

//Routes 

//Renders the root route and loads the info from the book db
router.get('/', asyncHandler(async(req, res, next) => {
    const books = await Book.findAll();
    res.render('index', {books}) ;
}));

//Loads a new book form
router.get('/new', (req, res) => {
    res.render('new-book', { book: {}, title: "New Book" });
});

//Adds the new book to the db and tells the user if they have missed a required field
router.post('/', asyncHandler(async(req, res) => {
    let book;
    try {
        book = await Book.create(req.body);
        res.redirect('/');
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            res.render('new-book', { book, errors: error.errors, title: 'New Book' });
        } else {
            throw error;
        }
    }
}));

//Loads the edit form for the selected book
router.get('/:id', asyncHandler(async(req, res, next) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render('update-book', { book, title: "Update Book" });
    } else {
        const err = new Error();
        err.status = 404;
        err.message = 'That does not exist.';
        next(err);
    }
}));

//Posts any edits made to the db and makes sure both required fields are filled out
router.post('/:id/edit', asyncHandler(async(req, res) => {
    let book;
    try {
        book = await Book.findByPk(req.params.id);
        if(book) {
            await book.update(req.body);
            res.redirect('/');
        } else {
            res.sendStatus(404);
        }
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            book = await Book.build(req.body);
            book.id = req.params.id;
            res.render('update-book', { book, errors: error.errors, title: 'Update Book' });
        } else {
            throw error;
        }
    }
}));

//Deletes the selected book from the db
router.post('/:id/delete', asyncHandler(async(req, res) => {
    let book;
    book = await Book.findByPk(req.params.id);
    if(book) {
        await book.destroy();
        res.redirect('/');
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;