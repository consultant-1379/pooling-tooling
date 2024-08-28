const expect = require('expect');

const { makeReserveFreshestAvailableTestEnvironmentInPool } = require('../../controllers/reserve-freshest-available-test-environment-in-pool');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { dbOperator } = require('../../../../data-access');
const { createQueryToSearchAvailableTestEnvironments } = require('../../use-cases');
const { patchTestEnvironment } = require('../../../test-environments/controllers');
const { getFreshestTestEnvironment } = require('../../../test-environments/controllers');
const logger = require('../../../../logger/logger');

describe('Integration Tests: (Pool service) Reserve freshest available environment in pool controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
  it('should reserve the freshest available environment successfully', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['dummy'],
      properties: {
        version: '1.0.0',
      },
    });

    const freshestFakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['dummy'],
      properties: {
        version: '2.0.0',
      },
    });

    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: [fakeTestEnvironment.id, freshestFakeTestEnvironment.id],
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(freshestFakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');

    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      dbOperator,
      createQueryToSearchAvailableTestEnvironments,
      getFreshestTestEnvironment,
      patchTestEnvironment,
      logger,
    );
    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';

    const reservedTestEnvironment = await reserveFreshestAvailableTestEnvironmentInPool(
      fakePool.poolName, requestId, requestorName,
    );
    expect(reservedTestEnvironment.id).toEqual(freshestFakeTestEnvironment.id);
    expect(reservedTestEnvironment.status).toEqual('Reserved');
    expect(reservedTestEnvironment.requestId).toEqual(requestId);
    expect(reservedTestEnvironment.additionalInfo).toEqual(`Reserved by ${requestorName}`);
  });
  it('should return a message if no test environments exist in the pool', async () => {
    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: [],
    });
    await dbOperator.insert(fakePool, 'pools');

    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      dbOperator,
      createQueryToSearchAvailableTestEnvironments,
      getFreshestTestEnvironment,
      patchTestEnvironment,
      logger,
    );
    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';

    const expectedResponse = `No test environments exist in the ${fakePool.poolName} pool`;

    const reserveFreshestAvailableTestEnvironmentInPoolResponse = await reserveFreshestAvailableTestEnvironmentInPool(
      fakePool.poolName, requestId, requestorName,
    );
    expect(reserveFreshestAvailableTestEnvironmentInPoolResponse).toEqual(expectedResponse);
  });
  it('should return a message if no available test environments exist', async () => {
    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: ['dummyId'],
    });
    await dbOperator.insert(fakePool, 'pools');

    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      dbOperator,
      createQueryToSearchAvailableTestEnvironments,
      getFreshestTestEnvironment,
      patchTestEnvironment,
      logger,
    );
    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';

    const expectedResponse = `No available test environments in the ${fakePool.poolName} pool`;

    const reserveFreshestAvailableTestEnvironmentInPoolResponse = await reserveFreshestAvailableTestEnvironmentInPool(
      fakePool.poolName, requestId, requestorName,
    );
    expect(reserveFreshestAvailableTestEnvironmentInPoolResponse).toEqual(expectedResponse);
  });

  it('should throw an error if some properties of the pool are not populated', async () => {
    let actualErrorMessage;
    const expectedErrorMessage = 'No pool name, requestor name or request ID provided';

    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['dummy'],
    });

    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: [fakeTestEnvironment.id],
    });

    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');

    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      dbOperator,
      createQueryToSearchAvailableTestEnvironments,
      getFreshestTestEnvironment,
      patchTestEnvironment,
      logger,
    );
    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';

    await reserveFreshestAvailableTestEnvironmentInPool('', requestId, requestorName).catch((error) => {
      actualErrorMessage = error.message;
    }).then(() => {
      expect(actualErrorMessage).toBe(expectedErrorMessage);
    });
  });

  after(async () => {
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
