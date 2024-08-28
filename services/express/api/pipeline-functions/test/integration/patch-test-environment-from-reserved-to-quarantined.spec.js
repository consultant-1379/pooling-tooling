const expect = require('expect');
const { dbOperator } = require('../../../../data-access');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

const { patchTestEnvironmentFromReservedToQuarantined } = require('../../controllers/index');

describe('Integration Test: (Pipeline Functions service) Testing patch controller to update the Test Environment (Reserved -> Quarantined) and/or Request', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      requestId: '',
      status: 'Reserved',
      stage: 'http://spinnaker.url',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      params: { name: fakeTestEnvironment.name },
    };

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.requestId).toEqual(fakeTestEnvironment.requestId);
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Reserved');
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);
    expect(testEnvironmentFromDbBeforePatching.stage).toEqual(fakeTestEnvironment.stage);

    const patchTestEnvironmentFromReservedToQuarantinedResponse = await patchTestEnvironmentFromReservedToQuarantined(testHttpRequest);
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.requestId).toEqual(fakeTestEnvironment.requestId);
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.status).toEqual('Quarantine');
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.additionalInfo).toEqual('Quarantined by Pipeline');
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.stage).toEqual(fakeTestEnvironment.stage);

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.requestId).toEqual(fakeTestEnvironment.requestId);
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Quarantine');
    expect(testEnvironmentFromDbAfterPatching.stage).toEqual(fakeTestEnvironment.stage);
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('Quarantined by Pipeline');
  });

  it('should return updatedTestEnvironment and updatedRequest only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Reserved',
      stage: 'http://spinnaker.url',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      params: { name: fakeTestEnvironment.name },
    };

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.requestId).toEqual(fakeTestEnvironment.requestId);
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Reserved');
    expect(testEnvironmentFromDbBeforePatching.stage).toEqual(fakeTestEnvironment.stage);
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);

    const patchTestEnvironmentFromReservedToQuarantinedResponse = await patchTestEnvironmentFromReservedToQuarantined(testHttpRequest);
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.requestId).toEqual(fakeTestEnvironment.requestId);
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.status).toEqual('Quarantine');
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.stage).toEqual(fakeTestEnvironment.stage);
    expect(patchTestEnvironmentFromReservedToQuarantinedResponse.additionalInfo).toEqual('Quarantined by Pipeline');

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.requestId).toEqual(fakeTestEnvironment.requestId);
    expect(testEnvironmentFromDbAfterPatching.stage).toEqual(fakeTestEnvironment.stage);
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Quarantine');
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('Quarantined by Pipeline');
  });

  it('should throw an error if the test environment is undefined or object is empty.', async () => {
    const testHttpRequest = {
      params: { name: 'TestEnvironmentDoesNotExist' },
    };

    const expectedErrorMessage = 'Retrieved test environment is undefined or the object is empty';
    let actualErrorMessage;
    await patchTestEnvironmentFromReservedToQuarantined(testHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
  });
});
