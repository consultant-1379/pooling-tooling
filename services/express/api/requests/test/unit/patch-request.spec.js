const expect = require('expect');

const { makePatchRequest } = require('../../controllers/patch-request');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { logger } = require('../../../../__test__/fixtures/logger.spec.js');

describe('Unit Test: (Request service) Patch request controller', () => {
  it('successfully patches a request', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued' });
    const patchRequest = makePatchRequest(
      () => fakeRequest,
      {
        findOneAndUpdate: () => {
          fakeRequest.status = 'Reserved';
          return fakeRequest;
        },
        findById: () => [fakeRequest],
      },
      logger,
    );
    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
      body: fakeRequest,
    };

    const patchedRequest = await patchRequest(fakeHttpRequest);
    expect(patchedRequest.status).toEqual('Reserved');
  });

  it('unsuccessfully patches a request', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeRequest = makeFakeRequest();
    const patchRequest = makePatchRequest(
      () => {
        throw Error(expectedErrorMessage);
      },
      { update: () => fakeRequest, findById: () => [fakeRequest] },
      logger,
    );

    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
      body: fakeRequest,
    };

    let actualErrorMessage;
    await patchRequest(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
