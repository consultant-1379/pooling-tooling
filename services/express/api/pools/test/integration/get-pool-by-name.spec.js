const expect = require('expect');

const { getPoolByName } = require('../../controllers');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Pool service) Get pool by name controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('pools');
  });

  it('successfully gets a pool by name', async () => {
    const fakePool = makeFakePool();
    await dbOperator.insert(fakePool, 'pools');
    const fakeHttpRequest = {
      params: {
        name: fakePool.poolName,
      },
    };

    const poolsMatchingName = await getPoolByName(fakeHttpRequest);
    expect(poolsMatchingName).toEqual([fakePool]);
  });

  it('returns empty if no pool with name exists', async () => {
    const fakeHttpRequest = {
      params: {
        name: 'dummy',
      },
    };
    const poolsMatchingName = await getPoolByName(fakeHttpRequest);
    expect(poolsMatchingName).toEqual([]);
  });

  it('throws error if more than one pool with the same name exists', async () => {
    const fakePool = makeFakePool({ poolName: 'iExist' });
    const anotherFakePool = makeFakePool({ poolName: 'iExist' });
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(anotherFakePool, 'pools');
    const fakeHttpRequest = {
      params: {
        name: fakePool.poolName,
      },
    };

    const expectedErrorMessage = `More than one Pool found with name ${fakePool.poolName}.`;
    let actualErrorMessage;
    await getPoolByName(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  after(async () => {
    await dbOperator.dropCollection('pools');
  });
});
