'use strict';

const express = require("express");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nunjucks = require("nunjucks");

module.exports = app;

// MIDDLEWARE
app.use(morgan("dev")); //logging
app.use(express.static(__dirname + '/public'));//serving up static files
app.use(bodyParser.urlencoded({ extended: true }));//parses incoming body values via req.body
app.use(bodyParser.json());

var env = nunjucks.configure('views', {noCache: true});
app.set('view engine', 'html'); // have res.render work with html files
app.engine('html', nunjucks.render);// when res.render works with html files, have it use nunjucks
