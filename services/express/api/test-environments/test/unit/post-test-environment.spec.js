const expect = require('expect');

const { makePostTestEnvironment } = require('../../controllers/post-test-environment');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Test Environment service) Post test environment controller', () => {
  const emitter = { emit: () => {} };
  it('successfully posts a test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const fakePool = makeFakePool();
    const postTestEnvironment = makePostTestEnvironment(
      () => fakeTestEnvironment,
      () => fakePool,
      {
        findAll: () => [fakeTestEnvironment], insert: () => fakeTestEnvironment, findBySearchQuery: () => [], update: () => {},
      },
      () => emitter,
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const fakeHttpRequest = {
      body: fakeTestEnvironment,
    };

    const postedTestEnvironment = await postTestEnvironment(fakeHttpRequest);
    expect(postedTestEnvironment).toEqual(fakeTestEnvironment);
  });

  it('unsuccessfully posts a test environment', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const postTestEnvironment = makePostTestEnvironment(
      () => {
        throw Error(expectedErrorMessage);
      },
      () => undefined,
      { insert: () => fakeTestEnvironment, update: () => {}, findBySearchQuery: () => [] },
      () => emitter,
      {
        info: () => 'Test log',
        error: () => 'Test error',
        logFormatter: () => {},
      },
    );
    const fakeHttpRequest = {
      body: fakeTestEnvironment,
    };
    let actualErrorMessage;
    await postTestEnvironment(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
