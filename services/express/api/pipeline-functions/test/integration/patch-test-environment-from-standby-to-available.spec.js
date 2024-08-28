const expect = require('expect');
const { dbOperator } = require('../../../../data-access');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

const { patchTestEnvironmentFromStandbyToAvailable } = require('../../controllers/index');

describe('Integration Test: (Pipeline Functions service) Testing patch controller to update the Test Environment (Standby -> Available)', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Standby',
      additionalInfo: 'userId: ERICSSON',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      params: { name: fakeTestEnvironment.name },
    };

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Standby');
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);

    const patchTestEnvironmentFromStandbyToAvailableResponse = await patchTestEnvironmentFromStandbyToAvailable(testHttpRequest);
    expect(patchTestEnvironmentFromStandbyToAvailableResponse.status).toEqual('Available');
    expect(patchTestEnvironmentFromStandbyToAvailableResponse.additionalInfo).toEqual('');

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Available');
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('');
  });

  it('should throw an error if the test environment is undefined or object is empty.', async () => {
    const testHttpRequest = {
      params: { name: 'TestEnvironmentDoesNotExist' },
    };

    const expectedErrorMessage = 'Retrieved test environment is undefined or the object is empty';
    let actualErrorMessage;
    await patchTestEnvironmentFromStandbyToAvailable(testHttpRequest).catch((error) => {
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
