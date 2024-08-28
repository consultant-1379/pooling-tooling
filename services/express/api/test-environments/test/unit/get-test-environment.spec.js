const expect = require('expect');

const { makeGetTestEnvironment } = require('../../controllers/get-test-environment');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Get test environment controller', () => {
  it('successfully gets a test environment', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironment = makeGetTestEnvironment({
      findById: () => fakeTestEnvironment,
    }, { info: () => 'Test log', logFormatter: () => {} });

    const fakeHttpRequest = {
      params: {
        id: fakeTestEnvironment.id,
      },
      body: fakeTestEnvironment,
    };

    const testEnvironment = await getTestEnvironment(fakeHttpRequest);
    expect(testEnvironment).toEqual(fakeTestEnvironment);
  });
  it('unsuccessfully gets a test environment', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironment = makeGetTestEnvironment({
      findById: () => {
        throw Error(expectedErrorMessage);
      },
    }, { info: () => 'Test log', logFormatter: () => {} });

    const fakeHttpRequest = {
      params: {
        id: fakeTestEnvironment.id,
      },
      body: fakeTestEnvironment,
    };

    let actualErrorMessage;
    await getTestEnvironment(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
