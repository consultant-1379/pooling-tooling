const expect = require('expect');

const { makePostPool } = require('../../controllers/post-pool');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Post pool controller', () => {
  const emitter = { emit: () => {} };
  it('successfully posts a pool', async () => {
    const fakePool = makeFakePool();
    const postPool = makePostPool(
      () => fakePool,
      {
        insert: () => fakePool,
        findBySearchQuery: () => {},
      },
      () => emitter,
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const request = {
      body: fakePool,
    };

    const postedPool = await postPool(request);
    expect(postedPool).toEqual(fakePool);
  });

  it('unsuccessfully posts a pool', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';

    const fakePool = makeFakePool();
    const postPool = makePostPool(
      () => {
        throw Error(expectedErrorMessage);
      },
      { insert: () => fakePool, findBySearchQuery: () => {} },
      () => emitter,
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const request = {
      headers: {
        'Content-Type': 'application/json',
      },
      body: fakePool,
    };
    let actualErrorMessage;
    await postPool(request).catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
