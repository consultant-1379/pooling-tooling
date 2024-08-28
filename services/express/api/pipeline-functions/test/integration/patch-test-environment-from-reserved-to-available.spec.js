const expect = require('expect');
const { dbOperator } = require('../../../../data-access');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

const { patchTestEnvironmentFromReservedToAvailable } = require('../../controllers/index');

describe('Integration Test: (Pipeline Functions service) Testing patch controller to update the Test Environment (Reserved -> Available) and/or Request', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      requestId: '',
      status: 'Reserved',
      additionalInfo: 'userId: ERICSSON',
      stage: 'http://spinnaker.url',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      params: { name: fakeTestEnvironment.name },
    };

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Reserved');
    expect(testEnvironmentFromDbBeforePatching.stage).toEqual(fakeTestEnvironment.stage);
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);

    const patchTestEnvironmentFromReservedToAvailableResponse = await patchTestEnvironmentFromReservedToAvailable(testHttpRequest);
    expect(patchTestEnvironmentFromReservedToAvailableResponse.requestId).toEqual('');
    expect(patchTestEnvironmentFromReservedToAvailableResponse.status).toEqual('Available');
    expect(patchTestEnvironmentFromReservedToAvailableResponse.stage).toEqual('');
    expect(patchTestEnvironmentFromReservedToAvailableResponse.additionalInfo).toEqual('');

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.requestId).toEqual('');
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Available');
    expect(testEnvironmentFromDbAfterPatching.stage).toEqual('');
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('');
  });

  it('should return updatedTestEnvironment and updatedRequest only.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Reserved' });
    const fakeTestEnvironment = makeFakeTestEnvironment({
      requestId: fakeRequest.id,
      status: 'Reserved',
      additionalInfo: 'userId: ERICSSON',
      stage: 'http://spinnaker.url',
    });
    await dbOperator.insert(fakeRequest, 'requests');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      params: { name: fakeTestEnvironment.name },
    };

    const [requestFromDbBeforePatching] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(requestFromDbBeforePatching.status).toEqual('Reserved');
    expect(requestFromDbBeforePatching.lastReservedAt).toBeFalsy();

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.requestId).toEqual(fakeRequest.id);
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Reserved');
    expect(testEnvironmentFromDbBeforePatching.stage).toEqual(fakeTestEnvironment.stage);
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);

    const patchTestEnvironmentFromReservedToAvailableResponse = await patchTestEnvironmentFromReservedToAvailable(testHttpRequest);
    expect(patchTestEnvironmentFromReservedToAvailableResponse.requestId).toEqual('');
    expect(patchTestEnvironmentFromReservedToAvailableResponse.status).toEqual('Available');
    expect(patchTestEnvironmentFromReservedToAvailableResponse.stage).toEqual('');
    expect(patchTestEnvironmentFromReservedToAvailableResponse.additionalInfo).toEqual('');

    const [requestFromDbAfterPatching] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(requestFromDbAfterPatching.status).toEqual('Unreserved');
    expect(requestFromDbAfterPatching.lastReservedAt).toBeTruthy();

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.requestId).toEqual('');
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Available');
    expect(testEnvironmentFromDbAfterPatching.stage).toEqual('');
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('');
  });

  it('should throw an error if the test environment is undefined or object is empty.', async () => {
    const testHttpRequest = {
      params: { name: 'TestEnvironmentDoesNotExist' },
    };

    const expectedErrorMessage = 'Retrieved test environment is undefined or the object is empty';
    let actualErrorMessage;
    await patchTestEnvironmentFromReservedToAvailable(testHttpRequest).catch((error) => {
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
