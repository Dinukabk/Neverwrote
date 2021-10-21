const index = require('../controllers/index');
const notebooks = require('../controllers/notebooks');
const notes = require('../controllers/notes');
const stats = require('../controllers/stats');

const routes = {};

// Connect our controllers to specific base paths.
// For example, actions defined in our notebooks controller should be available
// at paths beginning with /notebooks.
routes.connect = (app) => {
  // Use the index controller for /
  app.use('/', index);
  app.use('/notebooks', notebooks);
  app.use('/notes', notes);
  app.use('/stats', stats);
};

module.exports = routes;
