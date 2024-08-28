const expect = require('expect');

const { makeDeletePool } = require('../../controllers/delete-pool');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Remove pool controller', () => {
  const emitter = { emit: () => {} };
  it('unsuccessfully removes a pool', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';

    const fakePool = makeFakePool();
    const deletePool = makeDeletePool(
      () => undefined,
      {
        remove: () => {
          throw Error(expectedErrorMessage);
        },
        findById: () => [fakePool],
      },
      () => emitter,
      { info: () => 'Test log' },
    );

    const request = {
      params: {
        id: fakePool.id,
      },
    };

    let actualErrorMessage;
    await deletePool(request).catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
