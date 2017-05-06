'use strict';

const express = require("express");
const app = express();
const routes = require("./routes");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const nunjucks = require("nunjucks");
const models = require("./models");


// MIDDLEWARE
app.use(morgan("dev")); //logging
app.use(express.static(__dirname + '/public'));//serving up static files
app.use(bodyParser.urlencoded({ extended: true }));//parses incoming body values via req.body
app.use(bodyParser.json());

var env = nunjucks.configure('views', {noCache: true});
// have res.render work with html files
app.set('view engine', 'html');
// when res.render works with html files, have it use nunjucks
app.engine('html', nunjucks.render);

// Sync models by requiring mdels and syncing page and user models using promises
models.User.sync({})
.then(() => { return models.Page.sync({})})
.then(()=> app.listen(3000, () => {
  console.log("Listening on port 3000!")
  }));
