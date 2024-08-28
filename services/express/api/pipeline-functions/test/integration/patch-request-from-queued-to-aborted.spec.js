const expect = require('expect');
const { dbOperator } = require('../../../../data-access');

const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

const { patchRequestFromQueuedToAborted } = require('../../controllers');

describe('Integration Test: (Pipeline Functions service) Testing patch controller to update the Request (Queued -> Aborted)', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });
  it('should abort the request if it exists', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued' });
    await dbOperator.insert(fakeRequest, 'requests');
    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
    };

    const patchedRequest = await patchRequestFromQueuedToAborted(fakeHttpRequest);
    expect(patchedRequest.status).toEqual('Aborted');
  });

  it('should throw an error if the request doesn\'t exist', async () => {
    const expectedErrorMessage = 'Retrieved request is undefined or the object is empty';
    const fakeHttpRequest = {
      params: {
        id: 'inexistant_id',
      },
    };

    let actualErrorMessage;
    await patchRequestFromQueuedToAborted(fakeHttpRequest)
      .catch((error) => {
        actualErrorMessage = error.message;
      })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
