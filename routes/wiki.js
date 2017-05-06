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
  res.send("We made it to the /wiki GET route");
});

router.get('/add', (req, res, next) => {
  res.render('addpage')
});

