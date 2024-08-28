const expect = require('expect');
const { makeReserveRequest } = require('../../use-cases/reserve-request');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Queue service) Update status to \'Reserved\' for \'Queued\' requests.', () => {
  it('Ensure that the reserved environment is based off the queued request.', async () => {
    const fakeQueuedRequestToReserve = makeFakeRequest();

    const queuedRequest = {
      requestorDetails: {},
    };
    const reserveRequest = makeReserveRequest(
      { info: () => '' },
      { findOneAndUpdate: () => null },
      (poolName, id, requestorDetailsName) => {
        queuedRequest.poolName = poolName;
        queuedRequest.id = id;
        queuedRequest.requestorDetails.name = requestorDetailsName;
      },
      () => ({}),
    );

    await reserveRequest(fakeQueuedRequestToReserve);

    expect(queuedRequest.id).toStrictEqual(fakeQueuedRequestToReserve.id);
    expect(queuedRequest.poolName).toStrictEqual(fakeQueuedRequestToReserve.poolName);
    expect(queuedRequest.requestorDetails.name).toStrictEqual(fakeQueuedRequestToReserve.requestorDetails.name);
  });

  it('Ensure that the request is updated when condition is met.', async () => {
    const fakeQueuedRequestToReserve = makeFakeRequest();

    const availableTestEnvironmentId = 'availableTestEnvironmentId';
    let reservedRequest;
    const reserveRequest = makeReserveRequest(
      { info: () => '' },
      { findOneAndUpdate: () => null },
      () => ({
        id: availableTestEnvironmentId,
      }),
      (request) => {
        reservedRequest = request;
      },
    );

    await reserveRequest(fakeQueuedRequestToReserve);

    expect(reservedRequest).toStrictEqual(fakeQueuedRequestToReserve);
  });

  it('Ensure that the request is updated in database when condition is met.', async () => {
    const fakeQueuedRequestToReserve = makeFakeRequest();

    let reservedRequest;
    let updatedCollection;
    const reserveRequest = makeReserveRequest(
      { info: () => '' },
      {
        findOneAndUpdate: (collection, params, request) => {
          reservedRequest = request;
          updatedCollection = collection;
        },
      },
      () => ({
      }),
      () => fakeQueuedRequestToReserve,
    );

    await reserveRequest(fakeQueuedRequestToReserve);

    expect(reservedRequest).toStrictEqual(fakeQueuedRequestToReserve);
    expect(updatedCollection).toStrictEqual('requests');
  });

  it('Ensure that the message is logged based on the queued request when the condition is met.', async () => {
    const fakeQueuedRequestToReserve = makeFakeRequest();

    let loggedMessage;
    const reserveRequest = makeReserveRequest(
      {
        info: (message) => {
          loggedMessage = message;
        },
      },
      {
        findOneAndUpdate: () => {},
      },
      () => ({
      }),
      () => fakeQueuedRequestToReserve,
    );

    await reserveRequest(fakeQueuedRequestToReserve);

    expect(loggedMessage).toStrictEqual({ action: 'reserveRequest', actionParameters: { queuedRequest: `${fakeQueuedRequestToReserve.id}` }, service: 'Queue (use-case)' });
  });
});
