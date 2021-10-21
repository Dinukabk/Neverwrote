const request = require('request');

const models = require('../src/models');
const app = require('../src/app');
const path = require('path');
const mockDatabase = require('./helpers/mockDatabase');

const port = 3001;
const baseUrl = `http://localhost:${port}`;

describe('Notebook endpoints', () => {
  let server;

  beforeAll(() => {
    // Start the server
    server = app.listen(port);
  });

  afterAll(() => {
    // Stop the server
    server.close();
  });

  mockDatabase.useWithJasmine(models.database, [
    path.resolve(path.join(__dirname, 'fixtures/notebooks.json')),
    path.resolve(path.join(__dirname, 'fixtures/notes.json'))
  ]);

  describe('GET /notebooks', () => {
    it('returns a list of notebooks', done => {
      // Send a request
      request.get(`${baseUrl}/notebooks`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = [
          { id: 1, title: 'Research' },
          { id: 2, title: 'Chores' }
        ];
        expect(actual.length).toEqual(expected.length);
        for(let i = 0; i < expected.length; ++i) {
          expect(actual).toContain(jasmine.objectContaining(expected[i]));
        }

        done();
      });
    });
  });

  describe('GET /notebooks/:notebookId/notes', () => {
    it('returns all notes from the specified notebook', done => {
      // Send a request
      request.get(`${baseUrl}/notebooks/1/notes`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = [
          { id: 1, title: 'Perpetual motion machine', content: 'Not working.' },
          { id: 2, title: 'Vaccines', content: 'Do not cause autism.' }
        ];
        expect(actual.length).toEqual(expected.length);
        for(let i = 0; i < expected.length; ++i) {
          expect(actual).toContain(jasmine.objectContaining(expected[i]));
        }

        done();
      });
    });
  });

  describe('POST /notebooks', () => {
    const newNotebookAttrs = { title: 'Ideas' };

    it('creates a new notebook', done => {
      // Send a request
      request.post(`${baseUrl}/notebooks`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(newNotebookAttrs)
      }, (err, response) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();

        mockDatabase.db.query('SELECT * FROM Notebooks WHERE id = 3').then(queryResponse => {
          expect(queryResponse[0].length).toEqual(1);
          const actual = queryResponse[0][0];
          const expected = newNotebookAttrs;
          expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        done();
      });
    });

    it('returns the new notebook', done => {
      // Send a request
      request.post(`${baseUrl}/notebooks`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(newNotebookAttrs)
      }, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = newNotebookAttrs;
        expect(actual).toEqual(jasmine.objectContaining(expected));

        done();
      });
    });
  });

  describe('GET /notebooks/:notebookId', () => {
    it('returns the notebook with specified ID', done => {
      // Send a request
      request.get(`${baseUrl}/notebooks/1`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = { id: 1, title: 'Research' };
        expect(actual).toEqual(jasmine.objectContaining(expected));

        done();
      });
    });
  });

  describe('DELETE /notebooks/:notebookId', () => {
    it('deletes the notebook', done => {
      // Send a request
      request.delete(`${baseUrl}/notebooks/1`, (err, response) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();

        mockDatabase.db.query('SELECT * FROM Notebooks WHERE id = 1').then(queryResponse => {
          expect(queryResponse[0]).toEqual([]);
        });

        mockDatabase.db.query('SELECT * FROM Notes WHERE notebookId = 1').then(queryResponse => {
          expect(queryResponse[0]).toEqual([]);
        });

        done();
      });
    });

    it('returns an empty object', done => {
      // Send a request
      request.delete(`${baseUrl}/notebooks/1`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        expect(JSON.parse(body)).toEqual({});

        done();
      });
    });
  });

  describe('PUT /notebooks/:notebookId', () => {
    const updatedNotebookAttrs = { title: 'Study' };

    it('updates the notebook', done => {
      // Send a request
      request.put(`${baseUrl}/notebooks/1`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(updatedNotebookAttrs)
      }, (err, response) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();

        mockDatabase.db.query('SELECT * FROM Notebooks WHERE id = 1').then(queryResponse => {
          const actual = queryResponse[0][0];
          const expected = updatedNotebookAttrs;
          expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        done();
      });
    });

    it('returns the updated notebook', done => {
      // Send a request
      request.put(`${baseUrl}/notebooks/1`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(updatedNotebookAttrs)
      }, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = updatedNotebookAttrs;
        expect(actual).toEqual(jasmine.objectContaining(expected));

        done();
      });
    });
  });
});
