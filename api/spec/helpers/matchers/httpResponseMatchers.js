const toBeOk = () => ({
  compare: (actual) => {
    const result = {};

    result.pass = /^2\d\d$/.test(`${actual.statusCode}`);

    if(result.pass) {
      // Failure message for when the matcher is negated
      result.message = `Expected HTTP status code not to be 2xx OK, got ${actual.statusCode}`;
    } else {
      // Normal failure message
      result.message = `Expected HTTP status code to be 2xx OK, got ${actual.statusCode}`;
    }

    return result;
  }
});

const toContainJson = () => ({
  compare: (actual) => {
    const result = {};

    result.pass = actual.headers['content-type'].match('application/json');

    if(result.pass) {
      // Failure message for when the matcher is negated
      result.message = 'Expected content type not to be JSON';
    } else {
      // Normal failure message
      result.message = 'Expected content type to be JSON';
    }

    return result;
  }
});

// Register matchers so that they can be used in our tests
beforeEach(() => {
  jasmine.addMatchers({ toBeOk, toContainJson });
});
