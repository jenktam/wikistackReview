const express = require('express');
const app = express();

// Connect to routes by setting 1) path, 2) handlers
app.use('/wiki', require('./wiki'));
app.use('/user', require('./user'));

module.exports = app;
