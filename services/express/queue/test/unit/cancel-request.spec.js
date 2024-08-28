const expect = require('expect');
const { makeCancelRequest } = require('../../use-cases/cancel-request');
const { updateRequest } = require('../../../api/requests/use-cases');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Queue service) Update status to \'Aborted\' for \'Queued\' requests which are canceled.', () => {
  it('logs the first message using the queued request id.', async () => {
    const fakeQueuedRequestToCancel = makeFakeRequest();
    const loggedMessages = [];
    const cancelRequest = makeCancelRequest(
      {
        info: (message) => {
          loggedMessages.push(message);
        },
      },
      { findOneAndUpdate: () => {} },
      () => {},
    );
    await cancelRequest(fakeQueuedRequestToCancel);

    expect(loggedMessages[0]).toStrictEqual({ action: 'cancelRequest', actionParameters: { queuedRequest: `${fakeQueuedRequestToCancel.id}` }, service: 'Queue (use-case)' });
  });

  it('updates the status for a queued request to \'Aborted\'.', async () => {
    const fakeQueuedRequestToCancel = makeFakeRequest({ status: 'Queued' });
    let updatedRequest;
    const cancelRequest = makeCancelRequest(
      { info: () => '' },
      {
        findOneAndUpdate: (db, id, request) => {
          updatedRequest = request;
        },
      },
      updateRequest,
    );
    await cancelRequest(fakeQueuedRequestToCancel);
    expect(updatedRequest.$set.status).toEqual('Aborted');
  });

  it('logs the second message using the queued request id.', async () => {
    const fakeQueuedRequestToCancel = makeFakeRequest();
    const loggedMessages = [];
    const cancelRequest = makeCancelRequest(
      {
        info: (message) => {
          loggedMessages.push(message);
        },
      },
      { findOneAndUpdate: () => {} },
      () => {},
    );
    await cancelRequest(fakeQueuedRequestToCancel);
    expect(loggedMessages[1]).toStrictEqual({ action: 'cancelRequest', actionParameters: { queuedRequest: `${fakeQueuedRequestToCancel.id}` }, service: 'Queue (use-case)' });
  });
});
