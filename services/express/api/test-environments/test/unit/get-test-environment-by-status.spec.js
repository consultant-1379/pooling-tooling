const expect = require('expect');

const { makeGetTestEnvironmentsByStatus } = require('../../controllers/get-test-environment-by-status');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Get test environments by status controller', () => {
  it('successfully gets test environments by a given status', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironmentsByStatus = makeGetTestEnvironmentsByStatus({
      findBySearchQuery: () => [fakeTestEnvironment],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        status: fakeTestEnvironment.status,
      },
    };

    const testEnvironmentsByStatus = await getTestEnvironmentsByStatus(fakeHttpRequest);
    expect(testEnvironmentsByStatus).toEqual([fakeTestEnvironment]);
  });

  it('returns empty if no test environments have the specified status', async () => {
    const getTestEnvironmentsByStatus = makeGetTestEnvironmentsByStatus({
      findBySearchQuery: () => [],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        pool: 'dummy',
      },
    };
    const testEnvironmentsByStatus = await getTestEnvironmentsByStatus(fakeHttpRequest);
    expect(testEnvironmentsByStatus).toEqual([]);
  });
});
