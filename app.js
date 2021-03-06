// Deals with what renders on page to user on front end via routes

'use strict';

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const volleyball = require("volleyball");
const nunjucks = require("nunjucks");
const wikiRouter = require('./routes/wiki');
const userRouter = require('./routes/user');

module.exports = app;

// MIDDLEWARE
app.use(volleyball); //logging
app.use(express.static(__dirname + '/public'));//serving up static files
app.use(bodyParser.urlencoded({ extended: true }));//parses incoming body values via req.body
app.use(bodyParser.json());

var env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render);// when res.render works with html files, have it use nunjucks

// Connect to index routes by setting 1) path, 2) handlers
app.use('/wiki', wikiRouter);
app.use('/users', userRouter);

app.use( (err, req, res, next) => {
  console.error(err);
  res.status(500).send(err.message);
});
