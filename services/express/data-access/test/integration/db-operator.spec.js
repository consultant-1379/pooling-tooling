const faker = require('faker');
const expect = require('expect');

const { dbOperator } = require('../..');
const { Id } = require('../../../Id');

const collection = 'testCollection';
const collection2 = 'testCollection2';

function makeEntity(i) {
  const entity = {
    id: Id.makeId(),
    name: `${faker.random.word()}`,
    modifiedOn: new Date(),
  };
  if (i) {
    entity.pool = `pool_${i % 2 === 0 ? i : 'one'}`;
  }
  return entity;
}

describe('Integration Test: Data Access - makeDb', () => {
  const entities = [];
  const dbLen = 6;

  before(async () => {
    for (let i = 1; i < dbLen; i += 1) {
      const entity = makeEntity(i);
      const result = await dbOperator.insert(entity, 'testCollection');
      entities.push(result);
    }
  });
  after(async () => {
    await dbOperator.dropCollection(collection);
    await dbOperator.dropCollection(collection2);
  });

  it('createCollectionIndex: returns true when creating new index and if index exists already', async () => {
    const args = [{ name: 1 }, { unique: true }];

    let result = await dbOperator.createCollectionIndex(collection, ...args);
    expect(result).toEqual(true);

    result = await dbOperator.createCollectionIndex(collection, ...args);
    expect(result).toEqual(true);
  });

  it('findAll: should call the correct collection and return results', async () => {
    const result = await dbOperator.findAll(collection);

    expect(result.length).toEqual(entities.length);
  });

  it('findAll: should throw an error if no connection to DB', async () => {
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.findAll(collection);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('findAllSorted: should return sorted results', async () => {
    const sortFunction = (a, b) => a.name.localeCompare(b.name);
    const result = await dbOperator.findAllSorted(collection, sortFunction);
    const sortedEntities = entities.slice().sort(sortFunction);
    expect(result[0]).toEqual(sortedEntities[0]);
    expect(result[1]).toEqual(sortedEntities[1]);
    expect(result[-1]).toEqual(sortedEntities[-1]);
  });

  it('findAllSorted: should throw an error if no connection to DB', async () => {
    const sortFunction = (a, b) => a.name.localeCompare(b.name);
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.findAllSorted(collection, sortFunction);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('findById: should retrieve an item by its ID', async () => {
    const result = await dbOperator.findById(entities[0].id, collection);

    expect(result[0]).toEqual(entities[0]);
  });

  it('findById: should throw an error if no connection to DB', async () => {
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.findById(entities[0].id, collection);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('findBySearchQuery: should retrieve items based on search criteria', async () => {
    const searchCriteria = { pool: 'pool_one' };
    const result = await dbOperator.findBySearchQuery(
      searchCriteria,
      collection,
    );

    expect(result.length).toEqual(Math.floor(dbLen / 2));
  });

  it('findBySearchQuery: should throw an error if no connection to DB', async () => {
    const searchCriteria = { pool: 'pool_one' };
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.findBySearchQuery(searchCriteria, collection);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('findByAggregation: $match should retrieve items based on aggregation pipeline', async () => {
    const pipeline = [{ $match: { pool: 'pool_2' } }];
    const result = await dbOperator.findByAggregation(pipeline, collection);
    expect(result[0]).toEqual(entities[1]);
  });

  xit('findByAggregation: $set: should retrieve items based on aggregation pipeline', async () => {
    const pipeline = [
      {
        $set: {
          modifiedOnDate: { $dateFromString: { dateString: '$modifiedOn' } },
        },
      },
    ];

    const result = await dbOperator.findByAggregation(pipeline, collection);

    expect(result.length).toEqual(dbLen);
    expect(entities[0]).toBe(result[0]);
  });

  it('findByAggregation: $set, $unset should retrieve items based on aggregation pipeline', async () => {
    const pipeline = [
      { $match: { _id: entities[1].id } },
      { $set: { new: 'new' } },
      { $unset: 'new' },
    ];
    const result = await dbOperator.findByAggregation(pipeline, collection);

    expect(result.length).toEqual(1);
    expect(result.new).toBeFalsy();

    expect(result[0]).toEqual(entities[1]);
  });

  it('findByAggregation: should throw an error if no connection to DB', async () => {
    const pipeline = [{ $match: { pool: 'pool_2' } }];
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.findByAggregation(pipeline, collection);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('findBySearchQuerySorted: should retrieve and sort items based on search criteria', async () => {
    const pool = 'pool_one';
    const sortFunction = (a, b) => a.name.localeCompare(b.name);

    const result = await dbOperator.findBySearchQuerySorted(
      { pool },
      collection,
      sortFunction,
    );

    expect(result.length).toEqual(Math.floor(dbLen / 2));
    expect(result).toEqual(
      entities
        .slice()
        .sort(sortFunction)
        .filter((a) => a.pool === pool),
    );
  });

  it('findBySearchQuerySorted: should throw an error if no connection to DB', async () => {
    const pool = 'pool_one';
    const sortFunction = (a, b) => a.name.localeCompare(b.name);
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.findBySearchQuerySorted({ pool }, collection, sortFunction);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('findOneAndUpdate: should update an item and return updated result', async () => {
    const entity = makeEntity();
    const name = `${faker.random.word()}_name`;
    await dbOperator.insert(entity, collection);

    const result = await dbOperator.findOneAndUpdate(
      collection,
      { _id: entity.id },
      { $set: { name } },
    );

    expect(result.name).toEqual(name);
    expect(result.id).toEqual(entity.id);
  });

  it('findOneAndUpdate: should update an item and return updated result', async () => {
    const args = [{ name: 1 }, { unique: true }];

    await dbOperator.createCollectionIndex(collection, ...args);
    const { name } = entities[1];
    const expectedError = 'Failed to update entity';
    await dbOperator
      .findOneAndUpdate(collection, { _id: 'doesNotExist' }, { $set: { name } })
      .catch((error) => error.message)
      .then((message) => {
        expect(message).toBe(expectedError);
      });
  });

  it('findOneAndUpdate: should throw an error if no connection to DB', async () => {
    const args = [{ name: 1 }, { unique: true }];
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.createCollectionIndex(collection, ...args);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('insert: should insert an item and return it', async () => {
    const pool = 'new_pool';
    const result = await dbOperator.insert({ pool }, collection);

    expect(result.pool).toEqual(pool);
    expect(result.id).toBeTruthy();
  });

  it('insert: should throw an error if no connection to DB', async () => {
    const pool = 'insert_pool';
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.insert({ pool }, collection2);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('update: should update an item and return it', async () => {
    const name = 'unique';
    const entity = entities[0];
    entity.name = name;

    const result = await dbOperator.update(entity, collection);
    expect(result.name).toEqual(name);
    expect(result.id).toEqual(entity.id);
  });

  it('update: fail if name already exists due to indexes', async () => {
    const args = [{ name: 1 }, { unique: true }];

    await dbOperator.createCollectionIndex(collection, ...args);
    const { name } = entities[1];
    const entity = entities[0];
    entity.name = name;
    const expectedErrorRegex = new RegExp(
      `E11000 duplicate key error collection: .* index: .* dup key: { (|name): .${name}..}`,
    );
    await dbOperator
      .update(entity, collection)
      .catch((error) => error.message)
      .then((message) => {
        expect(message.match(expectedErrorRegex)).toBeTruthy();
      });
  });

  it('update: should throw an error if no connection to DB', async () => {
    const name = 'update_pool';
    const entity = entities[0];
    entity.name = name;
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.update(entity, collection);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });

  it('remove: should remove an item and return its ID', async () => {
    const name = 'new_name';
    const entity = await dbOperator.insert({ name }, collection);
    const result = await dbOperator.remove({ id: entity.id }, collection);
    expect(result.id).toEqual(entity.id);
  });

  it('remove: should throw an error if no connection to DB', async () => {
    const name = 'remove_pool';
    const entity = await dbOperator.insert({ name }, collection);
    const expectedError = 'DB connection error';

    dbOperator.dbConnector = async () => null;

    try {
      await dbOperator.remove({ id: entity.id }, collection);
    } catch (error) {
      expect(error.message).toBe(expectedError);
    }
  });
});
