const express = require('express');
const _ = require('lodash');
const models = require('../models');
const router = express.Router();

// This helper function takes the JSON object submitted in a request and
// selects only the fields that are allowed to be set by users
function postFilter(obj) {
  return _.pick(obj, [ 'title' ]);
}

// Index
router.get('/', (req, res) => {
  models.Note.count().then(noteCount => {
    models.Notebook.count().then(notebookCount => {
      models.Notebook.findOne({ order: [[ 'createdAt', 'ASC' ]] }).then(oldestNotebook => {
        models.Note.findOne({ order: [['createdAt', 'DESC' ]] }).then(recentlyUpdateNote => {
          res.json({
            'noteCount': noteCount,
            'notebookCount': notebookCount,
            'oldestNotebook': oldestNotebook.title,
            'recentlyUpdatedNote': recentlyUpdateNote.title
          });
        });  
      });
    });  
  });
});
/* *** TODO: Fill in the API endpoints for notebooks *** */
module.exports = router;
