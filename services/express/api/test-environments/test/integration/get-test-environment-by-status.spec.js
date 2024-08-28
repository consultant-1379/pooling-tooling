const expect = require('expect');

const { getTestEnvironmentsByStatus } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Test Environment service) Get test environments by status controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
  it('successfully gets test environments based on the status provided', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ status: 'status1' });
    const fakeTestEnvironment1 = makeFakeTestEnvironment({ status: 'status2' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakeTestEnvironment1, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        status: fakeTestEnvironment.status,
      },
    };

    const [testEnvironmentsByStatus] = await getTestEnvironmentsByStatus(fakeHttpRequest);
    expect(testEnvironmentsByStatus.status).toEqual(fakeTestEnvironment.status);
    expect(testEnvironmentsByStatus.status).not.toStrictEqual(fakeTestEnvironment1.status);
  });

  it('returns empty if no test environments have the specified status', async () => {
    const fakeHttpRequest = {
      params: {
        status: 'dummy',
      },
    };
    const testEnvironmentsByStatus = await getTestEnvironmentsByStatus(fakeHttpRequest);
    expect(testEnvironmentsByStatus).toEqual([]);
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
