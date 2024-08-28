const expect = require('expect');
const { makeResolveRequests } = require('../../controllers/resolve-requests');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Queue service) Resolve queued requests.', () => {
  it('does not check if execution is canceled if no requests are queued.', async () => {
    let executed = false;
    const resolveRequests = makeResolveRequests(
      { info: () => '' },
      { findBySearchQuery: () => null },
      'queued',
      () => {
        executed = true;
      },
      () => {},
      () => {},
    );

    await resolveRequests();

    expect(executed).not.toBeTruthy();
  });
  it('request is canceled if check for execution returns true.', async () => {
    const fakeRequest = makeFakeRequest();

    let isCanceled = false;
    const resolveRequests = makeResolveRequests(
      { info: () => '' },
      { findBySearchQuery: () => [fakeRequest] },
      'queued',
      () => true,
      () => {
        isCanceled = true;
      },
      () => {},
    );

    await resolveRequests();

    expect(isCanceled).toBeTruthy();
  });
  it('error is logged if canceling request results in an error.', async () => {
    const fakeRequest = makeFakeRequest();

    const testError = new Error('Error for test purposes');
    let messageLogged;
    const resolveRequests = makeResolveRequests(
      {
        info: () => '',
        error: (message) => {
          messageLogged = message;
        },
      },
      { findBySearchQuery: () => [fakeRequest] },
      'queued',
      () => true,
      () => {
        throw testError;
      },
      () => {},
    );

    await resolveRequests();

    expect(messageLogged).toStrictEqual({
      errorInfo: {
        error: testError,
        message: `Unable to determine if request with ID: ${fakeRequest.id} was canceled, skipping request in queue.`,
      },
      action: 'resolveRequests',
      actionParameters: { queuedRequestId: `${fakeRequest.id}` },
      service: 'Queue (controller)',
    });
  });
  it('if all conditions are met, then request is reserved.', async () => {
    const fakeRequest = makeFakeRequest();

    let isReserved = false;
    const resolveRequests = makeResolveRequests(
      { info: () => '' },
      { findBySearchQuery: () => [fakeRequest] },
      'queued',
      () => false,
      () => {
      },
      () => {
        isReserved = true;
      },
    );

    await resolveRequests();

    expect(isReserved).toBeTruthy();
  });
});
