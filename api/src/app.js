const express = require('express');
const bodyParser = require('body-parser');

const routes = require('./config/routes');

// Create a new Express app.
const app = express();

// Use the JSON body parser to convert JSON requests into JavaScript objects for
// us automatically.
app.use(bodyParser.json());

// Connect our routes.
routes.connect(app);

// Return app to the code which required this file.
module.exports = app;
