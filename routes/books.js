const express = require('express');
const router = express.Router();
const Book = require('../models').Book;

function asyncHandler(cb){
    return async(req, res, next) => {
        try{
            await cb(req, res, next)
        } catch(error){
            next(error);
        }
    }
}

router.get('/', asyncHandler(async(req, res, next) => {
    const books = await Book.findAll();
    res.render('index', {books}) ;
}));

router.get('/new', (req, res) => {
    res.render('new-book', { book: {} });
});

router.post('/', asyncHandler(async(req, res) => {
    let book;
    book = await Book.create(req.body);
    //console.log(req.body);
    res.redirect('/');
}));

router.get('/:id', asyncHandler(async(req, res) => {
    const book = await Book.findByPk(req.params.id);
    if(book) {
        res.render('update-book', { book });
    } else {
        res.sendStatus(404);
    }
}));

module.exports = router;