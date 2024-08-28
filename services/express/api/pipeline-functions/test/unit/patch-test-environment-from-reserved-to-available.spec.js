const expect = require('expect');
const sinon = require('sinon');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

const { makePatchTestEnvironmentFromReservedToAvailable } = require('../../controllers/patch-test-environment-from-reserved-to-available');

describe('Unit Test: (Pipeline Functions service) Testing patch controller to update the Test Environment (Reserved -> Available) and/or Request', () => {
  const emitter = { emit: () => { } };
  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Reserved',
      requestId: '',
      additionalInfo: 'userId: ERICSSON',
      stage: 'http://spinnaker.url',
    });
    const fakeRequest = makeFakeRequest();
    const fakeAvailableTestEnvironment = makeFakeTestEnvironment(fakeTestEnvironment, {
      status: 'Available',
      requestId: '',
      additionalInfo: '',
      stage: '',
    });

    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const patchTestEnvironmentFromReservedToAvailable = makePatchTestEnvironmentFromReservedToAvailable(
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findBySearchQuery: () => [fakeTestEnvironment],
        findById: () => [fakeRequest],
      },
      {
        listTestEnvironmentById: () => [fakeTestEnvironment],
        updateTestEnvironment: () => fakeAvailableTestEnvironment,
      },
      { updateRequest: () => fakeRequest },
      () => false,
      () => emitter,
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const testEnvironmentChanges = await patchTestEnvironmentFromReservedToAvailable(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeAvailableTestEnvironment);
  });

  it('should return updatedTestEnvironment and updatedRequest only.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Reserved' });
    const fakeTestEnvironment = makeFakeTestEnvironment({ status: 'Reserved' });
    const fakeAvailableTestEnvironment = {
      $set:
      makeFakeTestEnvironment(fakeTestEnvironment, {
        status: 'Available',
        requestId: '',
        additionalInfo: '',
      }),
    };

    const fakeHttpRequest = {
      params: {
        name: fakeTestEnvironment.name,
      },
    };

    const updateStub = sinon.stub();

    updateStub.onCall(0).returns(fakeRequest);
    updateStub.onCall(1).returns(fakeAvailableTestEnvironment);

    const patchTestEnvironmentFromReservedToAvailable = makePatchTestEnvironmentFromReservedToAvailable(
      {
        findOneAndUpdate: () => updateStub(),
        update: () => updateStub(),
        findBySearchQuery: () => [fakeTestEnvironment],
        findById: () => [fakeRequest],
      },
      {
        listTestEnvironmentById: () => fakeTestEnvironment,
        updateTestEnvironment: () => fakeAvailableTestEnvironment,
      },
      {
        updateRequest: (request) => {
          request.status = 'Unreserved';
          request.lastReservedAt = fakeRequest.modifiedOn;
          return request;
        },
      },
      () => true,
      () => emitter,
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const testEnvironmentChanges = await patchTestEnvironmentFromReservedToAvailable(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeAvailableTestEnvironment);
  });

  it('unsuccessfully patches test environment from reserved to available', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeRequest = makeFakeRequest();
    const expectedErrorMessage = 'Faking something going wrong!';
    const patchTestEnvironmentFromReservedToAvailable = makePatchTestEnvironmentFromReservedToAvailable(
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findBySearchQuery: () => [fakeTestEnvironment],
        findById: () => [fakeRequest],
      },
      {
        updateTestEnvironment: () => { throw Error(expectedErrorMessage); },
        listTestEnvironmentById: () => [fakeTestEnvironment],
      },
      { updateRequest: () => fakeRequest },
      () => false,
      () => emitter,
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
    await patchTestEnvironmentFromReservedToAvailable(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('throws an error when retrieved test environment is an empty object', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakeRequest = makeFakeRequest();
    const patchTestEnvironmentFromReservedToAvailable = makePatchTestEnvironmentFromReservedToAvailable(
      {
        findOneAndUpdate: () => fakeTestEnvironment,
        findBySearchQuery: () => [{}],
        findById: () => [fakeRequest],
      },
      {
        updateTestEnvironment: () => {},
        listTestEnvironmentById: () => [fakeTestEnvironment],
      },
      { updateRequest: () => fakeRequest },
      () => false,
      () => emitter,
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
    await patchTestEnvironmentFromReservedToAvailable(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
