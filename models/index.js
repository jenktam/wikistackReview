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
  },
  date: {
    type: Sequelize.DATE,
    defaultValue: Sequelize.NOW
  },
  tags: {
    type: Sequelize.ARRAY(Sequelize.TEXT),
    defaultValue: [],
    set: function (tags) {

    tags = tags || [];

    // if data not already an array. split and trim tags for later use
    if (typeof tags === 'string') {
        tags = tags.split(',').map(function (str) {
            return str.trim();
        });
    }

    this.setDataValue('tags', tags);
    }
  }
},{
  getterMethods: {
    // leave fn not => bc of this
    route: function() {
      return '/wiki/' + this.urlTitle;
    }
  },
    hooks: {
      beforeValidate: function(page) {
          if (page.title) {
              page.urlTitle = page.title.replace(/\s/g, '_').replace(/\W/g, '');
          } else {
              page.urlTitle = Math.random().toString(36).substring(2, 7);
          }
      }
    },
    classMethods: {
      findByTag: function(tag) {
        return this.findAll({
          where: {
            tags: {
              $contains: [tag]
            }
          }
        })
      }
    }
});

const User = db.define('user', {
  name: {
    type: Sequelize.STRING,
    allowNull: false
  },
  email: {
    type:Sequelize.STRING,
    allowNull: false,
    unique: true
  }
});

Page.belongsTo(User, {
    as: 'author'
});


module.exports = {
  db: db,
  Page: Page,
  User: User
}


//  getter method allows us to create a 'virtual' field when any query is made, so that as a user we see our table with the attribute route. however, not stores in our Postgres/psql db. Just get/create it every time we make a query
