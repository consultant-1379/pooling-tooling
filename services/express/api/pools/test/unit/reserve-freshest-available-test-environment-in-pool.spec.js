const expect = require('expect');

const { makeReserveFreshestAvailableTestEnvironmentInPool } = require('../../controllers/reserve-freshest-available-test-environment-in-pool');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Pool service) Reserve freshest available environment in pool controller', () => {
  it('should reserve the freshest available environment successfully', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      id: 1,
      status: 'Available',
      properties: {
        version: '1.0.0',
      },
    });

    const freshestFakeTestEnvironment = makeFakeTestEnvironment({
      id: 2,
      status: 'Available',
      properties: {
        version: '2.0.0',
      },
    });

    const fakePool = makeFakePool();

    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';
    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      {
        findBySearchQuery: (searchQuery) => {
          if (searchQuery.poolName) {
            return [fakePool];
          }
          return [fakeTestEnvironment];
        },
      },
      () => '',
      () => freshestFakeTestEnvironment,
      () => {
        freshestFakeTestEnvironment.requestId = 'someRequestId';
        freshestFakeTestEnvironment.additionalInfo = `Reserved by ${requestorName}`;
        freshestFakeTestEnvironment.status = 'Reserved';
        return freshestFakeTestEnvironment;
      },
      { info: () => 'Test log', error: () => 'Test error log' },
    );
    const reservedTestEnvironment = await reserveFreshestAvailableTestEnvironmentInPool(
      fakePool.poolName, requestId, requestorName,
    );
    expect(reservedTestEnvironment.id).toEqual(2);
    expect(reservedTestEnvironment.status).toEqual('Reserved');
    expect(reservedTestEnvironment.properties.version).toEqual('2.0.0');
    expect(reservedTestEnvironment.requestId).toEqual(requestId);
    expect(reservedTestEnvironment.additionalInfo).toEqual(`Reserved by ${requestorName}`);
  });
  it('should throw error if request id or requestor name not provided', (done) => {
    let actualErrorMessage;
    const expectedErrorMessage = 'No pool name, requestor name or request ID provided';
    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(null, null, null, null, { info: () => 'Test log', error: () => 'Test error log' });

    reserveFreshestAvailableTestEnvironmentInPool().catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      })
      .then(done, done);
  });
  it('should return a message if no test environments exist', async () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: [] });

    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      {
        findBySearchQuery: (searchQuery) => {
          if (searchQuery.poolName) {
            return [fakePool];
          }
          return [];
        },
      },
      () => '',
      () => {},
      () => {},
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const expectedResponse = `No test environments exist in the ${fakePool.poolName} pool`;

    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';
    const actualResponse = await reserveFreshestAvailableTestEnvironmentInPool(fakePool.poolName, requestId, requestorName);
    expect(actualResponse).toEqual(expectedResponse);
  });
  it('should return a message if no available test environments exist', async () => {
    const fakePool = makeFakePool();

    const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
      {
        findBySearchQuery: (searchQuery) => {
          if (searchQuery.poolName) {
            return [fakePool];
          }
          return [];
        },
      },
      () => '',
      () => {},
      () => {},
      { info: () => 'Test log', error: () => 'Test error log' },
    );

    const expectedResponse = `No available test environments in the ${fakePool.poolName} pool`;

    const requestId = 'someRequestId';
    const requestorName = 'someRequestorName';
    const actualResponse = await reserveFreshestAvailableTestEnvironmentInPool(fakePool.poolName, requestId, requestorName);
    expect(actualResponse).toEqual(expectedResponse);
  });
});
