const expect = require('expect');

const { makePostRequest } = require('../../controllers/post-request');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Request service) Post request controller', () => {
  it('successfully posts a request', async () => {
    const fakeRequest = makeFakeRequest();
    const fakePool = makeFakePool();
    const postRequest = makePostRequest(
      () => fakeRequest,
      {
        insert: () => fakeRequest,
        findBySearchQuery: () => [fakePool],
      },
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const fakeHttpRequest = {
      body: fakeRequest,
    };

    const postedRequest = await postRequest(fakeHttpRequest);
    expect(postedRequest).toEqual(fakeRequest);
  });

  it('unsuccessfully posts a request', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeRequest = makeFakeRequest();
    const fakePool = makeFakePool();
    const postRequest = makePostRequest(
      () => {
        throw Error(expectedErrorMessage);
      },
      {
        insert: () => fakeRequest,
        findBySearchQuery: () => [fakePool],
      },
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const fakeHttpRequest = {
      body: fakeRequest,
    };
    let actualErrorMessage;
    await postRequest(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  it('unsuccessfully posts a request due to no pool', async () => {
    const fakeRequest = makeFakeRequest();
    const expectedErrorMessage = `No pool in RPT with name: ${fakeRequest.poolName}`;
    const postRequest = makePostRequest(
      () => fakeRequest,
      {
        insert: () => fakeRequest,
        findBySearchQuery: () => [],
      },
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const fakeHttpRequest = {
      body: fakeRequest,
    };
    let actualErrorMessage;
    await postRequest(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
