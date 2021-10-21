const app = require('./app');

// Start the backend server and wait for connections
const server = app.listen(3000, () => {
  console.log('Started Neverwrote backend service');
});

module.exports = server;
