/**
 * This helper file provides a function for creating the Redux store. In
 * development mode it will also connect up the Redux development tools for
 * debugging purposes.
 */

const Redux = require('redux');
const reduxThunk = require('redux-thunk').default;
const combinedReducers = require('../reducers');

let finalCreateStore;

if(process.env.NODE_ENV === 'production') {
  finalCreateStore = Redux.compose(
    // Enables middleware
    Redux.applyMiddleware(reduxThunk)
  )(Redux.createStore);
} else {
  const DevTools = require('../components/DevTools');

  finalCreateStore = Redux.compose(
    // Enables middleware
    Redux.applyMiddleware(reduxThunk),
    // Enables DevTools
    DevTools.instrument()
  )(Redux.createStore);
}

module.exports = initialState => finalCreateStore(combinedReducers, initialState);
