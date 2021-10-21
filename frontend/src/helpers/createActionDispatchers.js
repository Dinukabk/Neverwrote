/**
 * Returns a function that, when given a dispatch function, returns an
 * object containing a bunch of action dispatchers.
 */
const createActionDispatchers = (...actionCreatorGroups) => dispatch =>
  // Iterate over actionCreatorsArray, which is an array of arrays of action
  // creators
  actionCreatorGroups.reduce((actionDispatchers, actionCreators) => {
    // Add an action dispatcher for each action creator in actionCreators
    Object.keys(actionCreators)
      .filter((name) => (typeof actionCreators[name] === 'function'))
      .forEach((name) => {
        actionDispatchers[name] = function(...actionCreatorArgs) {
          return dispatch(actionCreators[name].apply(this, actionCreatorArgs));
        };
      });
    return actionDispatchers;
  }, {});

module.exports = createActionDispatchers;
