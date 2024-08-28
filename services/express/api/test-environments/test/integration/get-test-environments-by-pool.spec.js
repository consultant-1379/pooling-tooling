const expect = require('expect');

const { getTestEnvironmentsByPool } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Test Environment service) Get test environments by pool controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
  it('successfully gets test environments in a given pool', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ pools: ['testPool1'] });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ pools: ['testPool2'] });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        pool: fakeTestEnvironment.pools,
      },
    };

    const [testEnvironmentsByPool] = await getTestEnvironmentsByPool(fakeHttpRequest);
    expect(testEnvironmentsByPool.pools).toEqual(fakeTestEnvironment.pools);
    expect(testEnvironmentsByPool.pools).not.toStrictEqual(fakeTestEnvironment1.pools);
  });

  it('returns empty if no test environments are assigned to the pool', async () => {
    const fakeHttpRequest = {
      params: {
        pool: 'dummy',
      },
    };
    const testEnvironmentsByPool = await getTestEnvironmentsByPool(fakeHttpRequest);
    expect(testEnvironmentsByPool).toEqual([]);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
