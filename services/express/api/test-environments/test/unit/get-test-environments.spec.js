const expect = require('expect');

const { makeGetTestEnvironments } = require('../../controllers/get-test-environments');
const { makeFakeTestEnvironment } = require('../../../../__test__/fixtures/test-environment.spec.js');

describe('Unit Test: (Test Environment service) Get test environments controller', () => {
  it('successfully gets test environments', async () => {
    const fakeTestEnvironment = makeFakeTestEnvironment();
    const getTestEnvironments = makeGetTestEnvironments({
      findAll: () => [fakeTestEnvironment],
    }, { info: () => 'Test log', logFormatter: () => {} });

    const allTestEnvironments = await getTestEnvironments();
    expect(allTestEnvironments).toEqual([fakeTestEnvironment]);
  });
  it('unsuccessfully gets test environments', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const getTestEnvironments = makeGetTestEnvironments({
      findAll: () => {
        throw Error(expectedErrorMessage);
      },
    }, { info: () => 'Test log', logFormatter: () => {} });

    let actualErrorMessage;
    await getTestEnvironments().catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
