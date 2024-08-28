const expect = require('expect');

const { makeGetPools } = require('../../controllers/get-pools');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Get pools controller', () => {
  it('successfully gets pools', async () => {
    const fakePool = makeFakePool();
    const getPools = makeGetPools({
      findAll: () => [fakePool],
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
    });
    const allPools = await getPools();
    expect(allPools).toEqual([fakePool]);
  });
  it('unsuccessfully gets pools', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const getPools = makeGetPools({
      findAll: () => {
        throw Error(expectedErrorMessage);
      },
    },
    {
      info: () => 'Test log',
      logFormatter: () => {},
    });
    let actualErrorMessage;
    await getPools().catch(async (error) => {
      actualErrorMessage = error.message;
    })
      .then(async () => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
