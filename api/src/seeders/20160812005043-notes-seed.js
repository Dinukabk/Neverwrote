const models = require('../models');
console.log(models);

module.exports = {
  up: function(queryInterface, Sequelize) {
    return models.Notebook.create({
      title: 'Housework'
    }).then(houseworkNotebook => {
      const notes = [
        {
          title: 'Shave the cat',
          content: 'The cat should be shaved once per month with number 4 clippers.',
          notebookId: houseworkNotebook.id
        },
        {
          title: 'Walk the flea',
          content: 'Might need to buy a leash first.',
          notebookId: houseworkNotebook.id
        }
      ];
      return Promise.all(notes.map(fields => models.Note.create(fields)));
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Notes', null, {})
      .then(() => queryInterface.bulkDelete('Notebooks', null, {}));
  }
};
