const app = require('../src/app');

describe('server.js', () => {
  it('starts a server listening on port 3000', () => {
    // Create a spy which replaces the app.listen method
    spyOn(app, 'listen').and.callFake(port => `Server on port ${port}`);

    const server = require('../src/server');
    expect(app.listen).toHaveBeenCalled();
    expect(server).toEqual('Server on port 3000');
  });
});
