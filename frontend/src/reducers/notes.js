const _ = require('lodash');
const api = require('../helpers/api');

// Action type constants
const INSERT_NOTE = 'INSERT_NOTE';
const CHANGE_NOTE = 'CHANGE_NOTE';
const REMOVE_NOTE = 'REMOVE_NOTE';
const ACTIVE_NOTES = 'ACTIVE_NOTES';
const ACTIVE_NOTE_ID = 'ACTIVE_NOTE_ID';

const initialState = {
  visibleNotes: [],
  activeNotes: [],
  activeNoteId: null,
};

// Function which takes the current data state and an action,
// and returns a new state
function reducer(state, action) {
  state = state || initialState;
  action = action || {};

  switch (action.type) {
    case INSERT_NOTE: {
      // Add in the new notes
      // Notice that we do not need to increment the note id. Since the notebook that we
      // are putting in is one that is returned by the api server which already has
      // the id incremented.
      const unsortedNotes = _.concat(state.visibleNotes, action.notes);
      const visibleNotes = _.orderBy(unsortedNotes, 'createdAt','desc');
      // Return updated state
      return _.assign({}, state, { visibleNotes } );
    }

    case ACTIVE_NOTES: {
      const activeNotes = _.filter(state.visibleNotes, { notebookId: action.notebookId });
      return _.assign({}, state, { activeNotes });
    }

    case ACTIVE_NOTE_ID: {
      const activeNoteId = action.activeNoteId;
      return _.assign({}, state, { activeNoteId });
    }

    // Changes a single notebook's data in the local store

    case CHANGE_NOTE: {
      const visibleNotes = _.clone(state.visibleNotes);
      const changedIndex = _.findIndex(state.visibleNotes, { id: action.note.id })
      visibleNotes[changedIndex] = action.note;
      return _.assign({}, state, { visibleNotes });
    }
    
    case REMOVE_NOTE: {
      const visibleNotes = _.reject(state.visibleNotes, { id: action.id });
      return _.assign({}, state, { visibleNotes });
    }

    default: return state;
  }
}

// Now we define a whole bunch of action creators
reducer.insertNotes = (notes) => {
  return { type: INSERT_NOTE, notes };
};

// Changes local notebook data
reducer.changeNote = (note) => {
  return { type: CHANGE_NOTE, note };
};

// Removes a notebook from the visible notebook list
reducer.removeNote = (id) => {
  return { type: REMOVE_NOTE, id };
};

reducer.activeNotes = (notebookId) => {
  return { type: ACTIVE_NOTES, notebookId };
};


// Attempts to delete a notebook from the server and removes it from the visible
// notebook list if successful

reducer.deleteNote = (noteId) => {
  // TODO Task 7: Add code to perform delete
  return (dispatch) => {
    api.delete('/notes/' + noteId).then(() => {
      dispatch(reducer.removeNote(noteId));
    }).catch(() => {
      alert('Failed to delete Note.');
    });
  };
};

// Attempts to update a notebook on the server and updates local notebook data if
// successful

reducer.saveNote = (editedNote, callback) => {
  return (dispatch) => {
    api.put('/notes/' + editedNote.id, editedNote).then((note) => {
      // Saves local notebook.
      dispatch(reducer.changeNote(note));
      callback();
    }).catch(() => {
      alert('Failed to save Note.  Are all of the fields filled in correctly?');
    });
  };
};

// Attempts to create a notebook on the server and inserts it into the local notebook
// list if successful
reducer.createNote = (newNote, callback) => {
  return (dispatch) => {
    api.post('/notes', newNote).then((notes) => {
      // This note is one that the store returns us! It has notebook id incremented to the next available id
      dispatch(reducer.insertNotes([ notes ]));
      callback();
    }).catch(() => {
      console.log('Failed to create Note. Are all of the fields filled in correctly?');
    });
  };
};

reducer.activeNotes = (notebookId, callback) => {
  return (dispatch) => {
    if (notebookId === null) return null;
    dispatch(reducer.activeNotes(notebookId));
    callback();
  }
};

// Load NOtes associated with notes
reducer.loadNotes = (notebookId, callback) => {
  return (dispatch) => {
    let path = '/notebooks/' + notebookId + '/notes';
    api.get(path).then((newNotebooks) => {
      dispatch(reducer.insertNotes(newNotebooks));
      callback();
    }).catch(() => console.log('Failed to load notes'));
  };
};

reducer.activateNodeFunc = (activeNoteId) => {
  return (dispatch) => {
    dispatch({ type: ACTIVE_NOTE_ID, activeNoteId });
  }
};
// Export the action creators and reducer
module.exports = reducer;