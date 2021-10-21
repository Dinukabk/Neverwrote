/**
 * This is the entry point for the JavaScript application which runs in the
 * web browser. We call `window.main` when the page loads, and use that
 * opportunity to create the Redux store and mount the root React component.
 */

const React = require('react');
const ReactDOM = require('react-dom');

const createStore = require('./helpers/createStore');
const Root = React.createFactory(require('./components/Root'));

// Initialisation function which we will call on page load
window.main = () => {
  // Create root React component with Redux store
  const store = createStore();
  const rootComponent = Root({ store });

  // Mount React root component in DOM
  const mountPoint = document.getElementById('root');
  ReactDOM.render(rootComponent, mountPoint);
};
