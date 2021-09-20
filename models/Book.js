'use strict';
const { Model, Sequelize } = require('sequelize');

module.exports = (sequelize) => {
  class Book extends Model {};
    Book.init({
      title: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          msg: 'Please enter a title.',
        }
      },
      author: {
        type: Sequelize.STRING,
        allowNull: false,
        validate: {
          msg: 'Please enter a title.',
        }
      },
      genre: {
        type: Sequelize.STRING
      },
      year: {
        type: Sequelize.INTEGER
      }
    }, {
      sequelize,
      modelName: 'Book',
   });
  return Book;
};