/**
 * The root React component from which all other components on the page are
 * descended. It is this component which is directly mounted on the DOM.
 */

const React = require('react');
const ReactRedux = require('react-redux');

const Provider = ReactRedux.Provider;
const Home = require('./Home');

// Enable development tools when in development mode
let DevTools = 'span';
if(process.env.NODE_ENV === 'development') {
  DevTools = require('./DevTools');
}
// Define the Root component
const Root = props => (
  /* The Provider gives descendants the ability to connect to the Redux store */
  <Provider store={props.store}>
    <div>
      {/* The Home component contains the guts of the page */}
      <Home />
      {/* DevTools is just an empty element when not in development mode */}
      <DevTools />
    </div>
  </Provider>
);

module.exports = Root;
