const expect = require('expect');

const { makeGetRequest } = require('../../controllers/get-request');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Request service) Get request controller', () => {
  it('successfully gets a request', async () => {
    const fakeRequest = makeFakeRequest();
    const getRequest = makeGetRequest({
      findById: () => fakeRequest,
    }, { info: () => 'Test log', logFormatter: () => {} });

    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
    };

    const getRequestResponse = await getRequest(fakeHttpRequest);
    expect(getRequestResponse).toEqual(fakeRequest);
  });
  it('unsuccessfully gets a request', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeRequest = makeFakeRequest();
    const getRequest = makeGetRequest({
      findById: () => {
        throw Error(expectedErrorMessage);
      },
    }, { info: () => 'Test log' });

    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
    };

    let actualErrorMessage;
    await getRequest(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
