const expect = require('expect');
const { reserveRequest } = require('../../use-cases');
const { dbOperator } = require('../../../data-access');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');
const { makeFakeTestEnvironment } = require('../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../__test__/fixtures/pool.spec.js');

describe('Integration Test: (Queue service) Update status to \'Reserved\' for \'Queued\' requests which are reserved.', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });
  it('updates the status for a canceled request.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['dummy'],
    });
    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: [fakeTestEnvironment.id],
    });
    const fakeRequest = makeFakeRequest({
      status: 'Queued',
      poolName: 'dummy',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeRequest, 'requests');
    await reserveRequest(fakeRequest);
    const [reservedRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(reservedRequest.status).toEqual('Reserved');
  });
  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
