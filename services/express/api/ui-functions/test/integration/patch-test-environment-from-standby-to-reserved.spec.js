const expect = require('expect');
const { dbOperator } = require('../../../../data-access');
const httpServer = require('../../../../server');
const logger = require('../../../../logger/logger');

const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

const { testEnvironmentService } = require('../../../test-environments/use-cases');
const { requestService } = require('../../../requests/use-cases');

const {
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
} = require('../../use-cases');

const { makePatchTestEnvironmentFromStandbyToReserved } = require('../../controllers/patch-test-environment-from-standby-to-reserved');

const patchTestEnvironmentFromStandbyToReserved = makePatchTestEnvironmentFromStandbyToReserved(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

describe('Integration Test: (UI Functions service) Testing patch controller to update the Test Environment (Standby -> Reserved) and/or Request', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should return updatedTestEnvironment only.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ requestId: '', status: 'Standby' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      body: {
        additionalInfo: 'userId: \'TESTING_ID\'',
      },
      params: { id: fakeTestEnvironment.id },
    };

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Standby');
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);

    const testEnvironmentChanges = await patchTestEnvironmentFromStandbyToReserved(testHttpRequest);
    expect(testEnvironmentChanges.requestId).toEqual('');
    expect(testEnvironmentChanges.status).toEqual('Reserved');
    expect(testEnvironmentChanges.additionalInfo).toEqual('userId: \'TESTING_ID\'');

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.requestId).toEqual('');
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Reserved');
    expect(testEnvironmentFromDbAfterPatching.stage).toEqual('Manual Reservation');
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('userId: \'TESTING_ID\'');
  });

  it('should return updatedTestEnvironment and updatedRequest only.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Reserved' });
    const fakeTestEnvironment = makeFakeTestEnvironment({ requestId: fakeRequest.id, status: 'Standby' });
    await dbOperator.insert(fakeRequest, 'requests');
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      body: {
        additionalInfo: 'userId: \'TESTING_ID\'',
      },
      params: { id: fakeTestEnvironment.id },
    };

    const [requestFromDbBeforePatching] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(requestFromDbBeforePatching.status).toEqual('Reserved');
    expect(requestFromDbBeforePatching.lastReservedAt).toBeFalsy();

    const [testEnvironmentFromDbBeforePatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbBeforePatching.requestId).toEqual(fakeRequest.id);
    expect(testEnvironmentFromDbBeforePatching.status).toEqual('Standby');
    expect(testEnvironmentFromDbBeforePatching.stage).toEqual(fakeTestEnvironment.stage);
    expect(testEnvironmentFromDbBeforePatching.additionalInfo).toEqual(fakeTestEnvironment.additionalInfo);

    const testEnvironmentChanges = await patchTestEnvironmentFromStandbyToReserved(testHttpRequest);
    expect(testEnvironmentChanges.requestId).toEqual('');
    expect(testEnvironmentChanges.status).toEqual('Reserved');
    expect(testEnvironmentChanges.stage).toEqual('Manual Reservation');
    expect(testEnvironmentChanges.additionalInfo).toEqual('userId: \'TESTING_ID\'');

    const [requestFromDbAfterPatching] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(requestFromDbAfterPatching.status).toEqual('Unreserved');
    expect(requestFromDbAfterPatching.lastReservedAt).toBeTruthy();

    const [testEnvironmentFromDbAfterPatching] = await dbOperator.findById(fakeTestEnvironment.id, 'testEnvironments');
    expect(testEnvironmentFromDbAfterPatching.requestId).toEqual('');
    expect(testEnvironmentFromDbAfterPatching.status).toEqual('Reserved');
    expect(testEnvironmentFromDbAfterPatching.stage).toEqual('Manual Reservation');
    expect(testEnvironmentFromDbAfterPatching.additionalInfo).toEqual('userId: \'TESTING_ID\'');
  });

  it('should throw an error if the test environment is undefined or object is empty.', async () => {
    const testHttpRequest = {
      body: {
        additionalInfo: 'userId: \'TESTING_ID\'',
      },
      params: { id: 'TestEnvironmentDoesNotExist' },
    };

    const testEnvironmentsFromDbBeforePatching = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentsFromDbBeforePatching.length).toEqual(0);

    const expectedErrorMessage = 'Retrieved test environment is undefined or the object is empty';
    let actualErrorMessage;
    await patchTestEnvironmentFromStandbyToReserved(testHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should throw a \'Not enough data to update the Test Environment and/or Request entities.\'', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ status: 'Standby' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      body: {
        additionalInfo: '',
      },
      params: { id: fakeTestEnvironment.id },
    };

    const testEnvironmentsFromDbBeforePatching = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentsFromDbBeforePatching.length).toEqual(1);

    const expectedErrorMessage = 'Not enough data to update the Test Environment and/or Request entities.';
    let actualErrorMessage;
    await patchTestEnvironmentFromStandbyToReserved(testHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('should throw an \'Invalid http request to update Test Environment and/or Request entity.\'', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ status: 'Standby' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const testHttpRequest = {
      body: {
        info: 'userId: \'TESTING_ID\'',
      },
      params: { id: fakeTestEnvironment.id },
    };

    const testEnvironmentsFromDbBeforePatching = await dbOperator.findAll('testEnvironments');
    expect(testEnvironmentsFromDbBeforePatching.length).toEqual(1);

    const expectedErrorMessage = 'Invalid http request to update Test Environment and/or Request entity.';
    let actualErrorMessage;
    await patchTestEnvironmentFromStandbyToReserved(testHttpRequest).catch((error) => {
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
