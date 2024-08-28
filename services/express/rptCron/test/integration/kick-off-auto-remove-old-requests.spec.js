const expect = require('expect');

const { dbOperator } = require('../../../data-access');

const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');
const { makeFakeTestEnvironment } = require('../../../__test__/fixtures/test-environment.spec.js');
const { kickOffAutoRemoveOldRequests } = require('../../controllers');

describe('Integration Test: (Cron service) Kick off auto remove old requests schedules controller', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('testEnvironments');
  });

  it('should successfully kick off the auto remove old requests job against empty requests', async () => {
    const wasAutoRemoveOldRequestsKickedOff = await kickOffAutoRemoveOldRequests();
    expect(wasAutoRemoveOldRequestsKickedOff).toBeTruthy();
  });

  it('should successfully kick off the auto remove old requests job against new requests and not remove requests', async () => {
    const fakeRequestOne = makeFakeRequest({ modifiedOn: new Date() });
    const newDate = new Date();
    newDate.setDate(newDate.getDate() - 30);
    const fakeRequestTwo = makeFakeRequest({ modifiedOn: newDate });
    await dbOperator.insert(fakeRequestOne, 'requests');
    await dbOperator.insert(fakeRequestTwo, 'requests');

    const wasAutoRemoveOldRequestsKickedOff = await kickOffAutoRemoveOldRequests();
    const requests = await dbOperator.findAll('requests');
    expect(wasAutoRemoveOldRequestsKickedOff).toBeTruthy();
    expect(requests.length).toEqual(2);
  });

  it('should successfully kick off the auto remove old requests job against old requests and remove requests', async () => {
    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 120);
    const fakeRequest = makeFakeRequest({ modifiedOn: oldDate });
    await dbOperator.insert(fakeRequest, 'requests');

    const wasAutoRemoveOldRequestsKickedOff = await kickOffAutoRemoveOldRequests();
    const requests = await dbOperator.findAll('requests');
    expect(wasAutoRemoveOldRequestsKickedOff).toBeTruthy();
    expect(requests.length).toEqual(0);
  });

  it('should successfully kick off the auto remove old requests job against old requests and not remove requests with corresponding test environments', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ id: '1234', test: '1234' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 120);
    const fakeRequest = makeFakeRequest({ modifiedOn: oldDate, testEnvironmentId: fakeTestEnvironment.id });
    await dbOperator.insert(fakeRequest, 'requests');

    const wasAutoRemoveOldRequestsKickedOff = await kickOffAutoRemoveOldRequests();
    const requests = await dbOperator.findAll('requests');
    expect(wasAutoRemoveOldRequestsKickedOff).toBeTruthy();
    expect(requests.length).toEqual(1);
  });

  it('should successfully kick off the auto remove old requests job against old requests and remove up to most recent with corresponding test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment({ id: '1234' });
    await dbOperator.insert(fakeTestEnvironment, 'testEnvironments');

    const oldDate = new Date();
    oldDate.setDate(oldDate.getDate() - 120);
    const fakeRequest = makeFakeRequest({ modifiedOn: oldDate, testEnvironmentId: fakeTestEnvironment.id });
    await dbOperator.insert(fakeRequest, 'requests');

    const olderDate = new Date();
    olderDate.setDate(olderDate.getDate() - 240);
    const anotherFakeRequest = makeFakeRequest({ modifiedOn: olderDate, testEnvironmentId: fakeTestEnvironment.id });
    await dbOperator.insert(anotherFakeRequest, 'requests');

    const wasAutoRemoveOldRequestsKickedOff = await kickOffAutoRemoveOldRequests();
    const requests = await dbOperator.findAll('requests');
    expect(wasAutoRemoveOldRequestsKickedOff).toBeTruthy();
    expect(requests.length).toEqual(1);
    expect(requests[0]).toEqual(fakeRequest);
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
