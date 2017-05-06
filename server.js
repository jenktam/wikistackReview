// Deals with connection to DB

'use strict';

const http = require('http');
const server = http.createServer();
const models = require('./models');
const app = require('./app');
const Promise = require('bluebird');

server.on('request', require('./app'));

// Other files
// Sync models by requiring mdels and syncing page and user models using promises
models.User.sync({})
.then(function(){
  return models.Page.sync({})
})
.then(function(){
  server.listen(3000, () => console.log("Listening on port 3000"));
})
.catch(console.error);

// models.User.sync({})
// .then(() => { return models.Page.sync({})})
// .then(()=> app.listen(3000, () => {
//   console.log("Listening on port 3000!")
// }))
// .catch(console.error);
