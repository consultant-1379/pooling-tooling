const expect = require('expect');

const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

const { makePatchRequestFromQueuedToAborted } = require('../../controllers/patch-request-from-queued-to-aborted');

describe('Unit Test: (Pipeline Functions service) Testing patch controller to update the Request (Queued -> Aborted)', () => {
  it('should abort the request if it exists', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued' });
    const fakeUpdatedRequest = makeFakeRequest(fakeRequest, {
      status: 'Aborted',
    });
    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
    };
    const patchRequestFromQueuedToAborted = makePatchRequestFromQueuedToAborted(
      {
        findOneAndUpdate: () => fakeUpdatedRequest,
        findById: () => [fakeRequest],
      },
      {
        updateRequest: () => fakeRequest,
      },
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    const patchedRequest = await patchRequestFromQueuedToAborted(fakeHttpRequest);
    expect(patchedRequest).toEqual(fakeUpdatedRequest);
  });
  it('should throw an error if the request doesn\'t exist', async () => {
    const expectedErrorMessage = 'Retrieved request is undefined or the object is empty';
    const fakeHttpRequest = {
      params: {
        id: 'inexistant_id',
      },
    };
    const patchRequestFromQueuedToAborted = makePatchRequestFromQueuedToAborted(
      {
        findById: () => { throw Error(expectedErrorMessage); },
      },
      {},
      {
        info: () => 'Test log', logFormatter: () => {},
      },
    );

    let actualErrorMessage;
    await patchRequestFromQueuedToAborted(fakeHttpRequest)
      .catch((error) => {
        actualErrorMessage = error.message;
      })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
