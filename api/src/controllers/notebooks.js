const express = require('express');
const _ = require('lodash');
const models = require('../models');
const router = express.Router();
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

// This helper function takes the JSON object submitted in a request and
// selects only the fields that are allowed to be set by users
function postFilter(obj) {
  return _.pick(obj, [ 'title' ]);
}

// Index
router.get('/', (req, res) => {
  let searchNotebookText = req.query.searchNotebookText;
  const conditions = {};

  if (searchNotebookText && searchNotebookText.trim() != "") {
    conditions.title = searchNotebookText;
  }
  
  const queryOptions = {
    order: [[ 'createdAt', 'DESC' ]],
    where: conditions
  };
  
  models.Notebook.findAll(queryOptions)
    .then(notebooks => res.json(notebooks))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Show Notes related to given notebook id
router.get('/:notebookId/notes', (req, res) => {
  // Return the specified post record from the database
  models.Notebook.findById(req.params.notebookId, {include: [ models.Note ]})
    .then(notebook => {
      if (notebook) {
        if (notebook.Notes !== undefined || notebook.Notes !== null) {
          res.json(notebook.Notes);
        }
      } else {
        res.json(null);
      }
    })
    .catch(err => res.status(500).json({ 
      error: err.message
    }));
});

// Create
router.post('/', (req, res) => {
  // Create a new post record in the database
  models.Notebook.create(postFilter(req.body))
    .then(notebook => res.json(notebook))
    .catch(err => res.status(422).json({ error: err.message }));
});


// Show
router.get('/:notebookId', (req, res) => {
  // Return the specified post record from the database
  models.Notebook.findById(req.params.notebookId)
    .then(notebook => res.json(notebook))
    .catch(err => res.status(500).json({ error: err.message }));
});

// Destroy
router.delete('/:notebookId', (req, res) => {
  // Delete the specified post record from the database
  models.Notebook.findById(req.params.notebookId)
    .then(notebook => notebook.destroy())
    .then(() => res.json({}))
    .catch(err => res.status(500).json({ 
      error: err.message 
    }));
});

// Update
router.put('/:notebookId', (req, res) => {
  // Update the specified post record in the database
  models.Notebook.findById(req.params.notebookId)
    .then(notebook => notebook.update(postFilter(req.body)))
    .then(notebook => res.json(notebook))
    .catch(err => res.status(422).json({ 
      error: err.message 
    }));
});
/* *** TODO: Fill in the API endpoints for notebooks *** */
module.exports = router;
