const expect = require('expect');

const { makeGetPoolById } = require('../../controllers/get-pool-by-id');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Get pool controller', () => {
  it('successfully gets a pool', async () => {
    const fakePool = makeFakePool();
    const getPool = makeGetPoolById({
      findById: () => fakePool,
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
    });

    const request = {
      params: {
        id: fakePool.id,
      },
    };

    const getPoolResponse = await getPool(request);
    expect(getPoolResponse).toEqual(fakePool);
  });
  it('unsuccessfully gets a pool', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakePool = makeFakePool();
    const getPool = makeGetPoolById({
      findById: () => {
        throw Error(expectedErrorMessage);
      },
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
    });

    const request = {
      params: {
        id: fakePool.id,
      },
    };

    let actualErrorMessage;
    await getPool(request).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
