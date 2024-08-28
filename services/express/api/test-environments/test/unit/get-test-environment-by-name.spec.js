const expect = require('expect');

const { makeGetTestEnvironmentByName } = require('../../controllers/get-test-environment-by-name');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Get test environment by name controller', () => {
  it('successfully gets a test environment by name', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironmentByName = makeGetTestEnvironmentByName({
      findBySearchQuery: () => [fakeTestEnvironment],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const testEnvironmentsMatchingName = await getTestEnvironmentByName(fakeHttpRequest);
    expect(testEnvironmentsMatchingName).toEqual([fakeTestEnvironment]);
  });

  it('returns empty if no environment with name exists', async () => {
    const getTestEnvironmentByName = makeGetTestEnvironmentByName({
      findBySearchQuery: () => [],
    }, { info: () => 'Test log', logFormatter: () => {} });
    const fakeHttpRequest = {
      params: {
        name: 'dummy',
      },
    };
    const testEnvironmentsMatchingName = await getTestEnvironmentByName(fakeHttpRequest);
    expect(testEnvironmentsMatchingName).toEqual([]);
  });

  it('returns 500 if more than one environment with the same name exists', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironmentByName = makeGetTestEnvironmentByName({
      findBySearchQuery: () => [fakeTestEnvironment, fakeTestEnvironment],
    }, { info: () => 'Test log', error: () => 'Test log error', logFormatter: () => {} });
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
});
