const request = require('request');

const models = require('../src/models');
const app = require('../src/app');
const path = require('path');
const mockDatabase = require('./helpers/mockDatabase');

const port = 3001;
const baseUrl = `http://localhost:${port}`;

describe('Note endpoints', () => {
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

  describe('GET /notes', () => {
    it('returns a list of notes', done => {
      // Send a request
      request.get(`${baseUrl}/notes`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = [
          { id: 1, title: 'Perpetual motion machine', content: 'Not working.' },
          { id: 2, title: 'Vaccines', content: 'Do not cause autism.' },
          { id: 3, title: 'Clean the house', content: 'Use strong cleaning products.' }
        ];
        expect(actual.length).toEqual(expected.length);
        for(let i = 0; i < expected.length; ++i) {
          expect(actual).toContain(jasmine.objectContaining(expected[i]));
        }

        done();
      });
    });
  });

  describe('POST /notes', () => {
    const newNoteAttrs = {
      title: 'Mow the lawn',
      content: 'Front and back.',
      notebookId: 2
    };

    it('creates a new note', done => {
      // Send a request
      request.post(`${baseUrl}/notes`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(newNoteAttrs)
      }, (err, response) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();

        mockDatabase.db.query('SELECT * FROM Notes WHERE id = 4').then(queryResponse => {
          expect(queryResponse[0].length).toEqual(1);
          const actual = queryResponse[0][0];
          const expected = newNoteAttrs;
          expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        done();
      });
    });

    it('returns the new note', done => {
      // Send a request
      request.post(`${baseUrl}/notes`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(newNoteAttrs)
      }, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = newNoteAttrs;
        expect(actual).toEqual(jasmine.objectContaining(expected));

        done();
      });
    });
  });

  describe('GET /notes/:noteId', () => {
    it('returns the note with specified ID', done => {
      // Send a request
      request.get(`${baseUrl}/notes/1`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = { id: 1, title: 'Perpetual motion machine', content: 'Not working.' };
        expect(actual).toEqual(jasmine.objectContaining(expected));

        done();
      });
    });
  });

  describe('DELETE /notes/:noteId', () => {
    it('deletes the note', done => {
      // Send a request
      request.delete(`${baseUrl}/notes/1`, (err, response) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();

        mockDatabase.db.query('SELECT * FROM Notes WHERE id = 1').then(queryResponse => {
          expect(queryResponse[0]).toEqual([]);
        });

        done();
      });
    });

    it('returns an empty object', done => {
      // Send a request
      request.delete(`${baseUrl}/notes/1`, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        expect(JSON.parse(body)).toEqual({});

        done();
      });
    });
  });

  describe('PUT /notes/:noteId', () => {
    const updatedNoteAttrs = {
      title: 'Impossible machine',
      content: 'Still impossible.',
      notebookId: 2
    };

    it('updates the note', done => {
      // Send a request
      request.put(`${baseUrl}/notes/1`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(updatedNoteAttrs)
      }, (err, response) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();

        mockDatabase.db.query('SELECT * FROM Notes WHERE id = 1').then(queryResponse => {
          const actual = queryResponse[0][0];
          const expected = updatedNoteAttrs;
          expect(actual).toEqual(jasmine.objectContaining(expected));
        });

        done();
      });
    });

    it('returns the updated note', done => {
      // Send a request
      request.put(`${baseUrl}/notes/1`, {
        headers: {
          ['content-type']: 'application/json',
        },
        body: JSON.stringify(updatedNoteAttrs)
      }, (err, response, body) => {
        expect(err).toBeFalsy();
        expect(response).toBeOk();
        expect(response).toContainJson();

        const actual = JSON.parse(body);
        const expected = updatedNoteAttrs;
        expect(actual).toEqual(jasmine.objectContaining(expected));

        done();
      });
    });
  });
});
