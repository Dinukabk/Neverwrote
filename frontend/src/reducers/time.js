const _ = require('lodash');

const UPDATE = 'neverwrote-frontend/time/UPDATE';

function reducer(state, action) {
  state = state || {};
  action = action || { type: null };

  switch(action.type) {
    case UPDATE: {
      return _.assign({}, state, { now: action.timeNow });
    } break;
    default:
      return state;
  }
}

reducer.setCurrentTime = function(timeNow) {
  return { type: UPDATE, timeNow }
};

module.exports = reducer;