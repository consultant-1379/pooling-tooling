const expect = require('expect');

const { dbOperator } = require('../../../../data-access');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { getPools } = require('../../controllers');

describe('Integration Test: (Pool service) Get pools controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('pools');
  });

  it('successfully gets pools', async () => {
    const fakePool = makeFakePool();
    const fakeAnotherPool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeAnotherPool, 'pools');

    const allPools = await getPools();
    expect(allPools.length).toEqual(2);
    expect(allPools[0]).toEqual(fakePool);
    expect(allPools[1]).toEqual(fakeAnotherPool);

    const poolsFromDb = await dbOperator.findAll('pools');
    expect(poolsFromDb.length).toEqual(2);
  });

  it('returns empty array if no pools are found', async () => {
    const allPools = await getPools();
    expect(allPools).toEqual([]);
  });

  after(async () => {
    await dbOperator.dropCollection('pools');
  });
});
