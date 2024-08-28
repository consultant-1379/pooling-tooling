const expect = require('expect');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

const { makePatchTestEnvironmentFromStandbyToAvailable } = require('../../controllers/patch-test-environment-from-standby-to-available');

describe('Unit Test: (Pipeline Functions service) Testing patch controller to update the Test Environment (Standby -> Available)', () => {
  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Standby',
      additionalInfo: 'userId: ERICSSON',
    });
    const fakeAvailableTestEnvironment = makeFakeTestEnvironment(fakeTestEnvironment, {
      status: 'Available',
      additionalInfo: '',
    });

    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findBySearchQuery: () => [fakeTestEnvironment],
      },
      {
        listTestEnvironmentById: () => [fakeTestEnvironment],
        updateTestEnvironment: () => fakeAvailableTestEnvironment,
      },
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const testEnvironmentChanges = await patchTestEnvironmentFromStandbyToAvailable(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeAvailableTestEnvironment);
  });

  it('unsuccessfully patches test environment from standby to available', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const expectedErrorMessage = 'Faking something going wrong!';
    const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findBySearchQuery: () => [fakeTestEnvironment],
      },
      {
        updateTestEnvironment: () => { throw Error(expectedErrorMessage); },
        listTestEnvironmentById: () => [fakeTestEnvironment],
      },
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    let actualErrorMessage;
    await patchTestEnvironmentFromStandbyToAvailable(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('throws an error when retrieved test environment is an empty object', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findBySearchQuery: () => [{}],
      },
      {
        updateTestEnvironment: () => {},
        listTestEnvironmentById: () => [fakeTestEnvironment],
      },
      {
        info: () => 'Test log', logFormatter: () => {}, error: () => 'Test error log',
      },
    );

    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const expectedErrorMessage = 'Retrieved test environment is undefined or the object is empty';

    let actualErrorMessage;
    await patchTestEnvironmentFromStandbyToAvailable(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
