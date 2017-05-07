'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;

router.get('/', (req, res, next) => {
  // res.send("We made it to the GET /user route");

});

router.post('/', (req, res, next) => {
  res.send("We made it to the POST /user route");
});

router.get('/add', (req, res, next) => {
  res.render('addpage')
});



module.exports = router;
