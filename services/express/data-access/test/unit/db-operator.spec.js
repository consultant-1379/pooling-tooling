const sinon = require('sinon');
const expect = require('expect');
const { makeDb } = require('../../db-operator');

describe('Unit Test: Data Access - makeDb', () => {
  let dbConnector;
  let Id;
  let logger;
  let dbStub;
  let dbConnectorMock;
  let loggerMock;
  const expectedErrorMsg = 'DB connection error';
  let badDb;

  beforeEach(() => {
    dbConnectorMock = sinon.stub();
    loggerMock = {
      error: sinon.spy(),
    };
    dbConnector = sinon.stub();
    Id = { makeId: sinon.stub() };
    logger = {
      error: sinon.spy(),
    };
    dbStub = {
      collection: sinon.stub().returns({
        find: sinon.stub().returns({
          toArray: sinon.stub(),
        }),
        aggregate: sinon.stub().returns({
          toArray: sinon.stub(),
        }),
        insertOne: sinon.stub(),
        updateOne: sinon.stub(),
        deleteOne: sinon.stub(),
        dropCollection: sinon.stub(),
        indexExists: sinon.stub(),
        createIndex: sinon.stub(),
        findOneAndUpdate: sinon.stub(),
      }),
      listCollections: sinon.stub().returns({
        toArray: sinon.stub(),
      }),
    };
    badDb = makeDb({
      dbConnector: dbConnectorMock,
      Id: {},
      logger: loggerMock,
    });
    dbConnector.resolves({
      db: dbStub,
      release: sinon.stub(),
    });
  });

  afterEach(() => {
    sinon.restore();
  });

  it('createCollectionIndex: returns true when creating new index', async () => {
    const collection = 'testCollection';
    const indexName = 'name_1';
    const args = [{ name: 1 }, { unique: true }];
    dbStub.collection().indexExists.resolves(true);
    dbStub.collection().createIndex.resolves(indexName);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.createCollectionIndex(collection, ...args);

    expect(result).toEqual(true);
  });

  it('createCollectionIndex: returns false when index is not created', async () => {
    const collection = 'testCollection';
    const indexName = 'name_1';
    const args = [{ name: 1 }, { unique: true }];
    dbStub.collection().indexExists.resolves(false);
    dbStub.collection().createIndex.resolves(indexName);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.createCollectionIndex(collection, ...args);

    expect(result).toEqual(false);
  });

  it('findAll: should call the correct collection and return results', async () => {
    const testData = [{ _id: 'test1', pool: 'pool1' }];
    dbStub.collection().find().toArray.resolves(testData);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findAll('testCollection');

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual([{ id: 'test1', pool: 'pool1' }]);
  });

  it('findAll: logs error when findAll encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;

    try {
      await badDb.findAll('testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);
    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'findAll',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while fetching data from the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('findAllSorted: should return sorted results', async () => {
    const testData = [
      { _id: 'test2', pool: 'pool1' },
      { _id: 'test1', pool: 'pool2' },
    ];
    dbStub.collection().find().toArray.resolves(testData);

    const sortFunction = (a, b) => a.pool.localeCompare(b.pool);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findAllSorted(
      'testCollection',
      sortFunction,
    );

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual([
      { id: 'test2', pool: 'pool1' },
      { id: 'test1', pool: 'pool2' },
    ]);
  });

  it('findAllSorted: logs error when findAllSorted encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;
    try {
      await badDb.findAllSorted('testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);

    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'findAllSorted',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while fetching sorted data from the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('findById: should retrieve an item by its ID', async () => {
    const testData = [{ _id: 'testId', pool: 'pool1' }];
    dbStub.collection().find().toArray.resolves(testData);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findById('testId', 'testCollection');

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual([{ id: 'testId', pool: 'pool1' }]);
  });

  it('findById: logs error when findById encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;

    try {
      await badDb.findById('testId', 'testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);
    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'findById',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while fetching data by ID from the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('findBySearchQuery: should retrieve items based on search criteria', async () => {
    const testData = [{ _id: 'testId', pool: 'pool1' }];
    dbStub.collection().find().toArray.resolves(testData);
    const searchCriteria = { pool: 'pool1' };

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findBySearchQuery(
      searchCriteria,
      'testCollection',
    );

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual([{ id: 'testId', pool: 'pool1' }]);
  });

  it('findBySearchQuery: logs error when findBySearchQuery encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;
    try {
      await badDb.findBySearchQuery('testQuery', 'testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);
    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'findBySearchQuery',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while fetching data by search query from the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('findBySearchQuery: throws custom error message when db connection fails', async () => {
    dbConnectorMock.rejects(new Error('DB connection error'));
    const searchCriteria = { key: 'value' };
    const collection = 'testCollection';

    let errorCaught;
    try {
      await badDb.findBySearchQuery(searchCriteria, collection);
    } catch (error) {
      errorCaught = error;
    }

    expect(errorCaught.message).toBe('DB connection error');

    sinon.assert.calledWith(
      loggerMock.error,
      sinon.match.has('service', 'Data Access'),
      'Error while fetching data by search query from the database: DB connection error',
    );
  });

  it('findByAggregation: should retrieve items based on aggregation pipeline', async () => {
    const testData = [{ _id: 'testId', pool: 'pool1' }];
    dbStub.collection().aggregate().toArray.resolves(testData);
    const pipeline = [{ $match: { pool: 'pool1' } }];

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findByAggregation(
      pipeline,
      'testCollection',
    );

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual([{ id: 'testId', pool: 'pool1' }]);
  });

  it('findByAggregation: logs error when findByAggregation encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;

    try {
      await badDb.findByAggregation([], 'testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);

    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'findByAggregation',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while fetching data by aggregation from the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('findBySearchQuerySorted: should retrieve and sort items based on search criteria', async () => {
    const testData = [
      { _id: 'testId1', pool: 'pool2' },
      { _id: 'testId2', pool: 'pool1' },
    ];
    dbStub.collection().find().toArray.resolves(testData);
    const searchCriteria = {};
    const sortFunction = (a, b) => a.pool.localeCompare(b.pool);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findBySearchQuerySorted(
      searchCriteria,
      'testCollection',
      sortFunction,
    );

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual([
      { id: 'testId2', pool: 'pool1' },
      { id: 'testId1', pool: 'pool2' },
    ]);
  });

  it('findBySearchQuerySorted: logs error when findBySearchQuerySorted encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;

    try {
      await badDb.findBySearchQuerySorted({}, 'testCollection', () => {});
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);
    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'findBySearchQuerySorted',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while fetching sorted data by search query from the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('findOneAndUpdate: should update an entity', async () => {
    const mongoResult = {
      lastErrorObject: { n: 1, updatedExisting: true },
      value: { _id: 'testId1', pool: 'pool2' },
      ok: 1,
    };

    dbStub.collection().findOneAndUpdate.resolves(mongoResult);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.findOneAndUpdate(
      'testCollection',
      { _id: 'testId1' },
      { pool: 'pool2' },
    );

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual(
      { id: 'testId1', pool: 'pool2' },
    );
  });

  it('findOneAndUpdate: logs error when findOneAndUpdate encounters an error', async () => {
    let errorMsg;
    const mongoResult = {
      lastErrorObject: { n: 1, updatedExisting: true },
      ok: 1,
    };

    dbStub.collection().findOneAndUpdate.resolves(mongoResult);

    const dbOperator = makeDb({ dbConnector, Id, logger });
    try {
      await dbOperator.findOneAndUpdate(
        'testCollection',
        { _id: 'testId1' },
        { pool: 'pool2' },
      );
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe('Failed to update entity');
  });

  it('insert: should insert an item and return it', async () => {
    const entity = { pool: 'pool1' };
    dbStub.collection().insertOne.resolves({ acknowledged: true, insertedId: 'testId' });

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.insert(entity, 'testCollection');

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual({ id: 'testId', pool: 'pool1' });
  });

  it('insert: logs error when insert encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;

    try {
      await badDb.insert({ id: 'testId', data: 'testData' }, 'testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);
    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'insert',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while inserting data into the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('update: should update an item and return it', async () => {
    const entity = { id: 'testId', pool: 'pool2' };
    dbStub.collection().updateOne.resolves({ modifiedCount: 1 });

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.update(entity, 'testCollection');

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual({ id: 'testId', pool: 'pool2' });
  });

  it('update: logs error when update encounters a database error', async () => {
    dbConnectorMock.rejects(new Error(expectedErrorMsg));
    let errorMsg;

    try {
      await badDb.update({ id: 'testId', data: 'testData' }, 'testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);

    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'update',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while updating data in the database: DB connection error',
      ),
    ).toBeTruthy();
  });

  it('update: should return updated entity when modifiedCount > 0', async () => {
    const entity = { id: 'testId', pool: 'pool2' };
    dbStub.collection().updateOne.resolves({ modifiedCount: 1 });

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.update(entity, 'testCollection');

    expect(result).toEqual(entity);
    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    sinon.assert.calledWith(dbStub.collection().updateOne, { _id: entity.id }, { $set: { pool: entity.pool } });
  });

  it('update: should return null when modifiedCount is 0 (no document updated)', async () => {
    const entity = { id: 'testId', pool: 'pool2' };
    dbStub.collection().updateOne.resolves({ modifiedCount: 0 });

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.update(entity, 'testCollection');

    expect(result).toBeNull();
    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    sinon.assert.calledWith(dbStub.collection().updateOne, { _id: entity.id }, { $set: { pool: entity.pool } });
  });

  it('remove: should remove an item and return its ID', async () => {
    const entity = { id: 'testId' };
    dbStub.collection().deleteOne.resolves({ deletedCount: 1 });

    const dbOperator = makeDb({ dbConnector, Id, logger });
    const result = await dbOperator.remove(entity, 'testCollection');

    sinon.assert.calledWith(dbStub.collection, 'testCollection');
    expect(result).toEqual({ id: 'testId' });
  });

  it('remove: logs error when remove encounters a database error', async () => {
    dbConnectorMock.rejects(new Error('DB connection error'));
    let errorMsg;

    try {
      await badDb.remove({ id: 'testId' }, 'testCollection');
    } catch (error) {
      errorMsg = error.message;
    }
    expect(errorMsg).toBe(expectedErrorMsg);

    expect(
      loggerMock.error.calledWithExactly(
        {
          service: 'Data Access',
          action: 'remove',
          actionParameters: { collection: 'testCollection' },
        },
        'Error while removing data from the database: DB connection error',
      ),
    ).toBeTruthy();
  });
});
