const expect = require('expect');

const { makePatchPool } = require('../../controllers/patch-pool');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Patch pool controller', () => {
  const emitter = { emit: () => {} };
  it('successfully patches a pool', async () => {
    const fakePool = makeFakePool();
    const patchPool = makePatchPool(
      () => fakePool,
      { findOneAndUpdate: () => fakePool, findById: () => fakePool },
      () => emitter,
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );
    const request = {
      params: {
        id: fakePool.id,
      },
      body: fakePool,
    };

    const patchedPool = await patchPool(request);
    expect(patchedPool).toEqual(fakePool);
  });

  it('unsuccessfully patches a pool', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakePool = makeFakePool();
    const patchPool = makePatchPool(
      () => {
        throw Error(expectedErrorMessage);
      },
      { findOneAndUpdate: () => fakePool, findById: () => fakePool },
      () => emitter,
      { info: () => 'Test log', error: () => 'Test log', logFormatter: () => {} },
    );

    const request = {
      params: {
        id: fakePool.id,
      },
      body: fakePool,
    };

    let actualErrorMessage;
    await patchPool(request).catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
