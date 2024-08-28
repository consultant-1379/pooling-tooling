const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { getPoolById } = require('../../controllers');

describe('Integration Test: (Pool service) Get pool by ID controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('pools');
  });

  it('successfully gets a pool by id', async () => {
    const fakePool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');

    const fakeHttpRequest = {
      params: {
        id: fakePool.id,
      },
    };

    const poolMatchingId = await getPoolById(fakeHttpRequest);
    expect(poolMatchingId).toEqual([fakePool]);
  });

  it('returns empty array if no pool with the Id exists', async () => {
    const fakeHttpRequest = {
      params: {
        id: 'doesNotExists',
      },
    };

    const poolMatchingId = await getPoolById(fakeHttpRequest);
    expect(poolMatchingId).toEqual([]);
  });

  after(async () => {
    await dbOperator.dropCollection('pools');
  });
});
