const expect = require('expect');
const {
  timeoutRequests,
} = require('../../controllers');
const { dbOperator } = require('../../../data-access');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');

describe('Integration Test: (Queue service) Update status to \'Timeout\' for \'Queued\' requests timed over two hours.', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });
  it('updates the status for a queued request timed over one hour.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued', requestTimeout: 3600000, createdOn: new Date('2021-09-13T21:00:00.000Z') });
    await dbOperator.insert(fakeRequest, 'requests');
    await timeoutRequests();
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    const [timeoutRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(timeoutRequest.status).toEqual('Timeout');
    expect(timeoutRequest.requestTimeout).toEqual(3600000);
  });
  it('updates the status for a queued request timed over two hour.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued', createdOn: new Date('2021-09-13T21:00:00.000Z') });
    await dbOperator.insert(fakeRequest, 'requests');
    await timeoutRequests();
    await new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
    const [timeoutRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(timeoutRequest.status).toEqual('Timeout');
    expect(timeoutRequest.requestTimeout).toEqual(7200000);
  });
  it('must not update a queued request if it was created less than two hours ago.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued' });
    await dbOperator.insert(fakeRequest, 'requests');
    await timeoutRequests();
    const [timeoutRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(timeoutRequest.status).toEqual('Queued');
    expect(timeoutRequest.requestTimeout).toEqual(7200000);
  });
  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
