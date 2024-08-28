const expect = require('expect');
const sinon = require('sinon');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

const { makePatchTestEnvironmentFromStandbyToAvailable } = require('../../controllers/patch-test-environment-from-standby-to-available.js');

describe('Unit Test: (UI Functions service) Testing patch controller to update the Test Environment (Standby -> Available) and/or Request', () => {
  const emitter = { emit: () => {} };
  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Standby',
      requestId: '',
      stage: 'http://spinnaker.url',
    });
    const fakeRequest = makeFakeRequest();

    const fakeHttpRequest = {
      body: {
        additionalInfo: { userId: 'ERICSSON' },
      },
      params: { id: fakeTestEnvironment.id },
    };

    const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
      { findOneAndUpdate: () => fakeTestEnvironment, findById: () => [fakeTestEnvironment] },
      {
        listTestEnvironmentById: () => fakeTestEnvironment,
        updateTestEnvironment: (testEnvironmentWithSameName = [], testEnvironment) => {
          testEnvironmentWithSameName[0] = null;
          testEnvironment.$set = {};
          testEnvironment.$set.status = 'Available';
          testEnvironment.$set.additionalInfo = fakeHttpRequest.body.additionalInfo;
          return testEnvironment;
        },
      },
      { updateRequest: () => fakeRequest },
      () => fakeHttpRequest,
      () => false,
      () => emitter,
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const testEnvironmentChanges = await patchTestEnvironmentFromStandbyToAvailable(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeTestEnvironment);
  });
  it('should return updatedTestEnvironment and updatedRequest only.', async () => {
    const fakeRequest = makeFakeRequest({
      status: 'Unreserved',
    });
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Standby',
      requestId: 'fakeid123',
      stage: 'http://spinnaker.url',
    });

    const fakeHttpRequest = {
      body: {
        additionalInfo: { userId: 'ERICSSON' },
      },
      params: { id: fakeTestEnvironment.id },
    };

    const updateStub = sinon.stub();
    const findByIdStub = sinon.stub();

    updateStub.onCall(0).returns(fakeRequest);
    updateStub.onCall(1).returns(fakeTestEnvironment);
    findByIdStub.onCall(0).returns([fakeTestEnvironment]);
    findByIdStub.onCall(1).returns([fakeRequest]);

    const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
      { update: () => updateStub(), findOneAndUpdate: () => updateStub(), findById: () => findByIdStub() },
      {
        listTestEnvironmentById: () => fakeTestEnvironment,
        updateTestEnvironment: (testEnvironmentWithSameName = [], testEnvironment) => {
          testEnvironmentWithSameName[0] = null;
          testEnvironment.$set = {};
          testEnvironment.$set.requestId = '';
          testEnvironment.$set.status = 'Available';
          testEnvironment.$set.stage = '';
          testEnvironment.$set.additionalInfo = fakeHttpRequest.body.additionalInfo;
          return testEnvironment;
        },
      },
      {
        updateRequest: () => { },
      },
      () => fakeHttpRequest,
      () => true,
      () => emitter,
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const testEnvironmentChanges = await patchTestEnvironmentFromStandbyToAvailable(fakeHttpRequest);
    expect(testEnvironmentChanges).toEqual(fakeTestEnvironment);
  });

  it('throws an error when retrieved test environment is an empty object', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();

    const fakeHttpRequest = {
      body: {
        additionalInfo: { userId: 'ERICSSON' },
      },
      params: { id: fakeTestEnvironment.id },
    };

    const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
      { update: () => fakeTestEnvironment, findById: () => [{}] },
      { },
      { },
      () => fakeHttpRequest,
      () => false,
      () => emitter,
      {
        info: () => 'Test log', error: () => 'Test log error', logFormatter: () => {},
      },
    );

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
