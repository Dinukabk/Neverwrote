/**
 * Specify all of your reducers in this file, so they can be combined into
 * one big reducer.
 */

const Redux = require('redux');
const notebooks = require('./notebooks');
const notes = require('./notes');
const statistics = require('./statistics');
const time = require('./time');

module.exports = Redux.combineReducers({
  notebooks,
  notes,
  time,
  statistics
  /* *** TODO: Put any other reducers in here *** */
  // eg. `notes: require('./notes')` if you have a reducer in reducers/notes.js
});
