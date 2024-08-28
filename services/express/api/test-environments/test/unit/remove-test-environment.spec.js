const expect = require('expect');

const { makeDeleteTestEnvironment } = require('../../controllers/remove-test-environment');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Remove test environment controller', () => {
  const emitter = { emit: () => {} };
  it('unsuccessfully removes a test environment', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const deleteTestEnvironment = makeDeleteTestEnvironment(
      () => {},
      () => {},
      () => {},
      {
        remove: () => {
          throw Error(expectedErrorMessage);
        },
        findById: () => [fakeTestEnvironment],
        findBySearchQuery: () => [],
        update: () => {},
      },
      () => emitter,
      { info: () => 'Test log' },
    );

    const fakeHttpRequest = {
      params: {
        id: fakeTestEnvironment.id,
      },
      body: fakeTestEnvironment,
    };

    let actualErrorMessage;
    await deleteTestEnvironment(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
