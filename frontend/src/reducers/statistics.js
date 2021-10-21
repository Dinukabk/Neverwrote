const _ = require('lodash');
const api = require('../helpers/api');

// An action constant
const UPDATE = 'UPDATE_Statistics';
// Hard-coded initial state of the store
const initialState = {
  stats: {
    "noteCount": 0,
    "notebookCount": 0,
    "oldestNotebook": "",
    "recentlyUpdatedNote": ""
  }
};

// Reducer function
function reducer(state, action) {
	action = action || {};
	state = state || initialState;

  switch(action.type) {
  	case UPDATE: {
      const stats = _.clone(action.stats);
      return _.assign({}, state, { stats } );
    }
    default: return state;
  }
}

// Action creator for loading an album's tracks
reducer.loadStatistics = (callback) => {
	return (dispatch) => {
    api.get("/stats").then((stats) => {
      dispatch({ type: UPDATE, stats });
      callback();
    });
  };
};
module.exports = reducer;