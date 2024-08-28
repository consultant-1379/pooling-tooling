const expect = require('expect');

const { makeGetRequests } = require('../../controllers/get-requests');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Request service) Get requests controller', () => {
  it('successfully gets requests', async () => {
    const fakeRequest = makeFakeRequest();
    const getRequests = makeGetRequests({
      findAll: () => [fakeRequest],
    }, { info: () => 'Test log' });

    const getRequestResponse = await getRequests();
    expect(getRequestResponse).toEqual([fakeRequest]);
  });
  it('unsuccessfully gets requests', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const getRequests = makeGetRequests({
      findAll: () => {
        throw Error(expectedErrorMessage);
      },
    }, { info: () => 'Test log' });

    let actualErrorMessage;
    await getRequests().catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
