const expect = require('expect');
const { resolveRequests } = require('../../controllers');
const { dbOperator } = require('../../../data-access');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');
const { makeFakePool } = require('../../../__test__/fixtures/pool.spec.js');
const { makeFakeTestEnvironment } = require('../../../__test__/fixtures/test-environment.spec.js');
const logger = require('../../../logger/logger');
const { cancelRequest, reserveRequest } = require('../../use-cases');
const { makeResolveRequests } = require('../../controllers/resolve-requests');

describe('Integration Test: (Queue service) Resolve a Queued request by assigning an available test environment.', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
  it('updates the status and test environment ID of a queued request if there is an available test environment.', async () => {
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
    const resolveRequestsMock = makeResolveRequests(
      logger,
      dbOperator,
      { status: 'Queued' },
      () => false,
      cancelRequest,
      reserveRequest,
    );
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeRequest, 'requests');
    await resolveRequestsMock();
    const [updatedRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(updatedRequest.status).toEqual('Reserved');
    expect(updatedRequest.testEnvironmentId).toEqual(fakeTestEnvironment.id);
  });

  it('does not do anything if there are not queued requests.', async () => {
    const fakeRequest = makeFakeRequest({
      status: 'Reserved',
      poolName: 'dummy',
      testEnvironmentId: '',
    });
    await dbOperator.insert(fakeRequest, 'requests');
    await resolveRequests();
    const allRequests = await dbOperator.findAll('requests');
    allRequests.forEach((request) => {
      expect(request.status).toEqual('Reserved');
    });
  });
  it('does not  update the status and test environment id of a queued request if there are no available test environments in the pool.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Reserved',
      pools: ['dummy'],
    });
    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: [fakeTestEnvironment.id],
    });
    const fakeRequest = makeFakeRequest({
      status: 'Queued',
      poolName: 'dummy',
      testEnvironmentId: '',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeRequest, 'requests');
    await resolveRequests();
    const [updatedRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(updatedRequest.status).toEqual('Queued');
    expect(updatedRequest.testEnvironmentId).toEqual('');
  });
  it('does not  update the status and test environment id of a non queued request.', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({
      status: 'Available',
      pools: ['dummy'],
    });
    const fakePool = makeFakePool({
      poolName: 'dummy',
      assignedTestEnvironmentIds: [fakeTestEnvironment.id],
    });
    const fakeRequest = makeFakeRequest({
      status: 'Reserved',
      poolName: 'dummy',
    });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');
    await dbOperator.insert(fakePool, 'pools');
    await dbOperator.insert(fakeRequest, 'requests');
    await resolveRequests();
    const [reservedRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(reservedRequest.status).toEqual(fakeRequest.status);
    expect(reservedRequest.poolName).toEqual(fakeRequest.poolName);
    expect(reservedRequest.testEnvironmentId).toEqual(fakeRequest.testEnvironmentId);
  });
  after(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
    await dbOperator.dropCollection('pools');
  });
});
