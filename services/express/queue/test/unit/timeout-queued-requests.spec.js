const expect = require('expect');
const {
  makeTimeoutQueuedRequest,
} = require('../../use-cases/timeout-queued-requests');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Queue service) Update status to \'Timeout\' for \'Queued\' requests timed over two hours.', () => {
  it('updates the status for a queued request timed over one hour.', async () => {
    const fakeQueuedRequestToTimeout = makeFakeRequest({ status: 'Queued', requestTimeout: 3600000, createdOn: new Date('2021-09-13T21:00:00.000Z') });
    const timeoutQueuedRequests = makeTimeoutQueuedRequest((request) => {
      request.status = 'Timeout';
      return request;
    });
    const timeoutRequest = await timeoutQueuedRequests(fakeQueuedRequestToTimeout);
    expect(timeoutRequest.status).toEqual('Timeout');
    expect(timeoutRequest.requestTimeout).toEqual(3600000);
  });

  it('updates the status for a queued request timed over two hour.', async () => {
    const fakeQueuedRequestToTimeout = makeFakeRequest({ status: 'Queued', createdOn: new Date('2021-09-13T21:00:00.000Z') });
    const timeoutQueuedRequests = makeTimeoutQueuedRequest((request) => {
      request.status = 'Timeout';
      return request;
    });
    const timeoutRequest = await timeoutQueuedRequests(fakeQueuedRequestToTimeout);
    expect(timeoutRequest.status).toEqual('Timeout');
    expect(timeoutRequest.requestTimeout).toEqual(7200000);
  });

  it('returns an empty array if queued request is not timed over two hours.', async () => {
    const fakeQueuedRequest = makeFakeRequest({ status: 'Queued' });
    const timeoutQueuedRequests = makeTimeoutQueuedRequest(() => null);
    const timeoutRequest = await timeoutQueuedRequests(fakeQueuedRequest);
    expect(timeoutRequest).toEqual(null);
  });
});
