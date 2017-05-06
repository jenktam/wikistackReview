'use strict';

const Sequelize = require("sequelize");
const db = new Sequelize("postgres://localhost:5432/wikistackReview");

// Define models/schemas
const Page = db.define('page', {
  title: {
    type:Sequelize.STRING, //for shorter strings
    allowNull: false
  },
  urlTitle: {
    type: Sequelize.STRING,
    allowNull: false
  },
  content: {
    type: Sequelize.TEXT, // for longer strings
    allowNull: true
  },
  status: {
    type: Sequelize.ENUM,
    values: ['open', 'closed'], // for array options
    allowNull: true
  }
});


//  a getter method allows for us to create a 'virtual' field when any query is made, so that as a user we see our table with the attribute route

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type:Sequelize.STRING,
    allowNull: false
  }
});


module.exports = {
  db: db,
  Page: Page,
  User: User
}
