const Sequelize = require('sequelize');

// Load our database configuration
const dbConfig = require('../config/database');

// Connect Sequelize to the database
const sequelize = new Sequelize(
  dbConfig.database,
  dbConfig.user,
  dbConfig.password,
  dbConfig
);

// Load all of our model definitions
const models = {
  Note: sequelize.import(require.resolve('./note')),
  Notebook: sequelize.import(require.resolve('./notebook'))
};

// Run all associations
models.Notebook.hasMany(models.Note, {
  foreignKey: 'notebookId',
});
models.Note.belongsTo(models.Notebook, {
  foreignKey: 'notebookId'
});

models.database = sequelize;

// Export our model definitions
module.exports = models;
