/**
 * This is the entry point for the JavaScript application which runs on the
 * server.
 */

// Require Babel, which will allow us to use JSX in other files
require('babel-core/register');

// Require our server-side Express app
const app = require('./app');

// Start the frontend server and wait for connections
const server = app.listen(3000, () => {
  console.log('Started Neverwrote frontend service');
});

module.exports = server;
