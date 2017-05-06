'use strict';

const express = require('express');
const app = express();
const router = express.Router();
const models = require('../models');
const Page = models.Page;
const User = models.User;
module.exports = router;

router.get('/', (req, res, next) => {
  res.send("We made it to the /wiki GET route");
});
