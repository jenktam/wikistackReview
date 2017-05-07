'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

// render the addpage.html template into true HTML and send it back to the client.
router.get('/', (req, res, next) => {
  Page.findAll({})
  .then((pages) => {
    res.render('index', {pages: pages});
  })
});

router.get('/add', (req, res, next) => {
  res.render('addpage');
});

// implemented hook to fix post urlTitle not null validation
router.post('/', (req, res, next) => {
  // // res.json works properly!
  // Page.create(req.body)
	// .then(res.json.bind(res))
	// .catch(next)

  // Save new page to the db
    User.findOrCreate({
            where: {
                name: req.body.name,
                email: req.body.email
            }
        })
        .spread(function (user, createdPageBool) {
            return Page.create(req.body)
                .then(function (page) {
                    return page.setAuthor(user);
                });
        })
        .then(function (page) {
            res.redirect(page.route);
        })
        .catch(next);

});

// router.get('/:urlTitle', (req,res,next) => {
//   Page.findOne({
//     where: {
//       urlTitle: req.params.urlTitle
//     },
//     include: [
//       {model: User, as: 'author'}
//     ]
//   })
//   .then( (page) => {
//     if (page === null) {
//       throw generateError('No page found with this title', 404);
//     } else {
//     console.log("page", page)
//       res.render('wikipage', {page: page})
//     }
//   })
//   .catch(next);
// });

function generateError (message, status) {
    let err = new Error(message);
    err.status = status;
    return err;
}

module.exports = router;
