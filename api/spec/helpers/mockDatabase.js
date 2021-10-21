const Promise = require('bluebird');

const SequelizeMocking = require('sequelize-mocking').SequelizeMocking;

const mockDatabase = {};

mockDatabase.mock = (originalDb, fixturePaths) => {
  if(typeof fixturePaths === 'string' || fixturePaths instanceof String) {
    fixturePaths = [fixturePaths];
  }

  return SequelizeMocking.create(originalDb, { logging: false })
    .then(mocked => Promise.mapSeries(fixturePaths, fixturePath =>
      SequelizeMocking.loadFixtureFile(mocked, fixturePath, { logging: false }))
      .then(() => mocked))
    .then(mocked => { mockDatabase.db = mocked; });
};

mockDatabase.unmock = () => {
  // If we don't have a mocked database on record, resolve early
  if(!mockDatabase.db) {
    return Promise.resolve();
  }

  return Promise.resolve(mockDatabase.db)
    .then(model => model.getQueryInterface())
    .then(qi => qi.dropAllTables({ logging: false }))
    .then(() => {
      SequelizeMocking.unhookNewModel(mockDatabase.db);

      if(mockDatabase.db.__originalSequelize) {
        SequelizeMocking.modifyModelReferences(
          mockDatabase.db, mockDatabase.db.__originalSequelize);
        delete mockDatabase.db.__originalSequelize;
      }
      delete mockDatabase.db;
    })
};

mockDatabase.useWithJasmine = (originalDb, fixturePath) => {
  beforeEach(done => {
    mockDatabase.mock(originalDb, fixturePath).catch((err) => {
      try {
        done.fail(err.message);
      } catch(ex) {}
    }).then(done);
  });

  afterEach(done => {
    mockDatabase.unmock().catch((err) => {
      try {
        done.fail(err.message);
      } catch(ex) {}
    }).then(done);
  });
};

module.exports = mockDatabase;
