const expect = require('expect');

const { makeGetPoolByName } = require('../../controllers/get-pool-by-name');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Get pool by name controller', () => {
  it('successfully gets a pool by name', async () => {
    const fakePool = makeFakePool();
    const getPoolByName = makeGetPoolByName({
      findBySearchQuery: () => [fakePool],
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
      error: () => 'Test error log',
    });
    const fakeHttpRequest = {
      params: {
        name: fakePool.name,
      },
    };

    const poolMatchingName = await getPoolByName(fakeHttpRequest);
    expect(poolMatchingName).toEqual([fakePool]);
  });

  it('returns empty if no pool with name exists', async () => {
    const getPoolByName = makeGetPoolByName({
      findBySearchQuery: () => [],
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
      error: () => 'Test error log',
    });
    const fakeHttpRequest = {
      params: {
        name: 'dummy',
      },
    };
    const poolMatchingName = await getPoolByName(fakeHttpRequest);
    expect(poolMatchingName).toEqual([]);
  });

  it('throws error if more than one pool with the same name exists', async () => {
    const fakePool = makeFakePool();
    const getPoolByName = makeGetPoolByName({
      findBySearchQuery: () => [fakePool, fakePool],
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
      error: () => 'Test error log',
    });
    const fakeHttpRequest = {
      params: {
        name: fakePool.name,
      },
    };

    const expectedErrorMessage = `More than one Pool found with name ${fakePool.name}.`;
    let actualErrorMessage;
    await getPoolByName(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
