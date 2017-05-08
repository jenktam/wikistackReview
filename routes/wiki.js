'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
module.exports = router;


// render the addpage.html template into true HTML and send it back to the client.
router.get('/', (req, res, next) => {
  Page.findAll({})
  .then((pages) => {
    res.render('index', {pages: pages});
  })
  .catch(next)
});

// implemented hook to fix post urlTitle not null validation
// need to build GET /wiki/:urlTitle before can show page from clicking button
router.post('/', (req, res, next) => {
  User.findOrCreate({
    where: {
      email: req.body.authorEmail,
      name: req.body.authorName
    }
  })
  .spread((user,createdBool) => {

    // after form submitted will add or find user and then create new page in page db
    return Page.create({
      title: req.body.title,
      content: req.body.content,
      status: req.body.status,
      tags: req.body.tags
    })
    .then( function(createdPage) {
      console.log("req.body",req.body)
      return createdPage.setAuthor(user); // using association methods!! relationship method from belongTo in models/index.js
    })
    .then( (createdPage) => {
      res.redirect(createdPage.route);
    })
  })
  // var author = User.build({
  //   name: req.body.authorName,
  //   email: req.body.authorEmail
  // });

  // author.save()
  // .then( (savedAuthor) => {
  //   console.log(savedAuthor)
  // })
  // .catch(next);


  // // res.json works properly!
  // Page.create(req.body)
	// .then(res.json.bind(res))
	// .catch(next)

  // console.log(req.body);
  // var newPage = Page.build(req.body);

  // newPage.save()
  // .then( (savedPage) => {
  //   res.redirect(savedPage.route)
  // })
  // .catch(next);


});

// needs to be above /wiki/:urlTitle to ensure not urlTitle
router.get('/add', (req, res, next) => {
  res.render('addpage');
});

function generateError (message, status) {
    let err = new Error(message);
    err.status = status;
    return err;
}

router.get('/search', (req,res,next) => {

  Page.findByTag(req.query.search)
  .then( (pages) => {
    res.render('index', {pages: pages})
  })
  .catch(next);

});

router.get('/:urlTitle', (req,res,next) => {
  Page.findOne({
    where: {
      urlTitle: req.params.urlTitle
    },
    include: [
      {model: User, as: 'author'}
    ]
  })
  .then( (page) => {
    if (page === null) {
      throw generateError('No page found with this title', 404);
    }

    return page.getAuthor()
    .then(function(author){
      // console.log("author", author);
      page.author = author;

      res.render('wikipage', {page: page})
    })

  })
  .catch(next);
});

// router.post('/:urlTitle', function (req, res, next) {

//     Page.update(req.body, {
//             where: {
//                 urlTitle: req.params.urlTitle
//             },
//             returning: true
//         })
//         .spread(function (updatedRowCount, updatedPages) { //all updated pages are returned. We will only be looking at one of them
//             console.log(updatedPages[0]);
//             res.redirect(updatedPages[0].route);
//             //alternatively we could do a findAll after the update instead of using `returning` keyword
//         })
//         .catch(next);

// });

router.get('/:urlTitle/edit', function (req, res, next) {

    Page.findOne({
            where: {
                urlTitle: req.params.urlTitle
            },
            include: [
                {model: User, as: 'author'}
            ]
        })
        .then(function (page) {
            if (page === null) {
                //to show you sendStatus in contrast to using the error handling middleware above
                res.sendStatus(404);
            } else {
                res.render('editpage', {
                    page: page
                });
            }
        })
        .catch(next);


});

router.get('/:urlTitle/edit', function (req, res, next) {

  Page.findOne({
          where: {
              urlTitle: req.params.urlTitle
          },
          include: [
              {model: User, as: 'author'}
          ]
      })
      .then(function (page) {
          if (page === null) {
              //to show you sendStatus in contrast to using the error handling middleware above
              res.sendStatus(404);
          } else {
              res.render('editpage', {
                  page: page
              });
          }
      })
      .catch(next);


});

router.get('/:urlTitle/delete', (req,res,next) => {
  Page.destroy({
    where: {
      urlTitle: req.params.urlTitle
    }
  })
  .then( () => res.redirect('/wiki'))
  .catch(next);
})
