const expect = require('expect');

const { makeGetTestEnvironmentsByPool } = require('../../controllers/get-test-environments-by-pool');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Get test environments by pool controller', () => {
  it('successfully gets test environments in a given pool', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironmentsByPool = makeGetTestEnvironmentsByPool({
      findBySearchQuery: () => [fakeTestEnvironment],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        pool: fakeTestEnvironment.pools,
      },
    };

    const testEnvironmentsByPool = await getTestEnvironmentsByPool(fakeHttpRequest);
    expect(testEnvironmentsByPool).toEqual([fakeTestEnvironment]);
  });

  it('returns empty if no test environments are assigned to the pool', async () => {
    const getTestEnvironmentsByPool = makeGetTestEnvironmentsByPool({
      findBySearchQuery: () => [],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        pool: 'dummy',
      },
    };
    const testEnvironmentsByPool = await getTestEnvironmentsByPool(fakeHttpRequest);
    expect(testEnvironmentsByPool).toEqual([]);
  });
});
