const expect = require('expect');

const { getTestEnvironmentByName } = require('../../controllers');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Test Environment service) Get test environment by name controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
  it('successfully gets a test environment by name', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const testEnvironmentMatchingName = await getTestEnvironmentByName(fakeHttpRequest);
    expect(testEnvironmentMatchingName).toEqual([fakeTestEnvironment]);
  });

  it('returns empty if no environment with name exists', async () => {
    const fakeHttpRequest = {
      params: {
        name: 'dummy',
      },
    };
    const testEnvironmentMatchingName = await getTestEnvironmentByName(fakeHttpRequest);
    expect(testEnvironmentMatchingName).toEqual([]);
  });

  it('returns 500 if more than one environment with the same name exists', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ name: 'iExist' });
    const anotherFakeTestEnvironment = makeFakeTestEnvironment({ name: 'iExist' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(anotherFakeTestEnvironment, 'testEnvironments');
    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const expectedErrorMessage = 'More than one Test Environment found with same name. Please contact Thunderbee';
    let actualErrorMessage;
    await getTestEnvironmentByName(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });
});
