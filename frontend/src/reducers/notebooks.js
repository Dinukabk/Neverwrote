const _ = require('lodash');
const api = require('../helpers/api');

// Action type constants
const INSERT_NOTEBOOK = 'INSERT_NOTEBOOK';
const FETCH_NOTES     = 'FETCH_NOTES';
const CHANGE_NOTEBOOK = 'CHANGE_NOTEBOOK';
const REMOVE_NOTEBOOK = 'REMOVE_NOTEBOOK';
const FILTER_NOTEBOOK = 'FILTER_NOTEBOOK';

const initialState = {
  visibleNotebooks: [],
  visibleNotes: [],
  activeId : null,
};

// Function which takes the current data state and an action,
// and returns a new state
function reducer(state, action) {
  state = state || initialState;
  action = action || {};


  switch (action.type) {
    // Inserts new notebooks into the local store
    case INSERT_NOTEBOOK: {
      // Add in the new notebooks
      // Notice that we do not need to increment the notebook id. Since the notebook that we
      // are putting in is one that is returned by the api server which already has
      // the id incremented.
      const unsortedNotebooks = _.concat(state.visibleNotebooks, action.notebooks);
      const visibleNotebooks = _.orderBy(unsortedNotebooks, 'createdAt','desc');
      // Return updated state
      return _.assign({}, state, { visibleNotebooks} );
    }

    case FILTER_NOTEBOOK: {
      // Add in the new notebooks
      // Notice that we do not need to increment the notebook id. Since the notebook that we
      // are putting in is one that is returned by the api server which already has
      // the id incremented.
      const visibleNotebooks = _.orderBy(action.notebooks, 'createdAt', 'desc');
      // Return updated state
      return _.assign({}, state, { visibleNotebooks} );
    }

    case FETCH_NOTES: {
      // Add in the new notes
      // Notice that we do not need to increment the note id. Since the notebook that we
      // are putting in is one that is returned by the api server which already has
      // the id incremented.
      const unsortedNotes = _.clone(action.newNotebooks);
      const visibleNotes = _.orderBy(unsortedNotes, 'createdAt', 'desc');
      const activeId = action.notebookId;
      // Return updated state
      return _.assign({}, state, { visibleNotes, activeId } );
    }

    // Changes a single notebook's data in the local store
    case CHANGE_NOTEBOOK: {
      const visibleNotebooks = _.clone(state.visibleNotebooks);
      const changedIndex = _.findIndex(state.visibleNotebooks, { id: action.notebook.id })
      visibleNotebooks[changedIndex] = action.notebook;
      return _.assign({}, state, { visibleNotebooks });
    }
    
    // Removes a single notebook from the visible notebook list
    case REMOVE_NOTEBOOK: {
      const visibleNotebooks = _.reject(state.visibleNotebooks, { id: action.id });
      return _.assign({}, state, { visibleNotebooks });
    }
    default: return state;
  }
}

// Now we define a whole bunch of action creators
// Inserts notebooks into the notebook list
reducer.insertNotebooks = (notebooks) => {
  return { type: INSERT_NOTEBOOK, notebooks };
};

reducer.fetchNotes = (newNotebooks, notebookId) => {
  return { type: FETCH_NOTES, newNotebooks, notebookId };
};

// Changes local notebook data
reducer.changeNotebook = (notebook) => {
  return { type: CHANGE_NOTEBOOK, notebook };
};

// Removes a notebook from the visible notebook list
reducer.removeNotebook = (id) => {
  return { type: REMOVE_NOTEBOOK, id };
};

reducer.filterNotebook = (notebooks) => {
  return { type: FILTER_NOTEBOOK, notebooks };
};

// Attempts to delete a notebook from the server and removes it from the visible
// notebook list if successful
reducer.deleteNotebook = (notebookId) => {
  // TODO Task 7: Add code to perform delete
  return (dispatch) => {
    api.delete('/notebooks/' + notebookId).then(() => {
      dispatch(reducer.removeNotebook(notebookId));
    }).catch(() => {
      alert('Failed to delete notebook.');
    });
  };
};

// Attempts to update a notebook on the server and updates local notebook data if
// successful
reducer.saveNotebook = (editedNotebook, callback) => {
  return (dispatch) => {
    api.put('/notebooks/' + editedNotebook.id, editedNotebook).then((notebook) => {
      // Saves local notebook.
      dispatch(reducer.changeNotebook(notebook));
      callback();
    }).catch(() => {
      alert('Failed to save notebook.  Are all of the fields filled in correctly?');
    });
  };
};

// Attempts to create a notebook on the server and inserts it into the local notebook
// list if successful
reducer.createNotebook = (newNotebook, callback) => {
  return (dispatch) => {
    api.post('/notebooks', newNotebook).then((notebooks) => {
      // This notebook is one that the store returns us! It has notebook id incremented to the next available id
      dispatch(reducer.insertNotebooks([ notebooks ]));
      callback();
    }).catch(() => {
      alert('Failed to create notebook. Are all of the fields filled in correctly?');
    });
  };
};

// Attempts to load more notebooks from the server and inserts them into the local
// notebook list if successful
reducer.loadNotebooks = (callback) => {
  return (dispatch) => {
    let path = '/notebooks';
    api.get(path).then((newNotebooks) => {
      dispatch(reducer.insertNotebooks(newNotebooks));
      callback();
    }).catch(() => {
      console.log('Failed to load notebooks');
    });
  };
};
// Load NOtes associated with notes
reducer.loadNotes = (notebookId, callback) => {
  return (dispatch) => {
    let path = '/notebooks/' + notebookId + '/notes';
    api.get(path).then((newNotebooks) => {
      dispatch(reducer.fetchNotes(newNotebooks, notebookId));
      callback();
    }).catch(() => console.log('Failed to load notes'));
  };
};

reducer.searchNotebookChange = (searchText, callback) => {
  return (dispatch) => {
    let path = '/notebooks?searchNotebookText=' + searchText;
    api.get(path).then((notebooks) => {
      dispatch(reducer.filterNotebook(notebooks));
      callback();
    }).catch(() => {
      console.log('Failed to load notebooks');
    });
  };
};
// Export the action creators and reducer
module.exports = reducer;