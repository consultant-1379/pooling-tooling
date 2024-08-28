const expect = require('expect');

const { makeDeleteRequest } = require('../../controllers/remove-request');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Request service) Remove request controller', () => {
  it('unsuccessfully removes a request', async () => {
    const expectedErrorMessage = 'Faking something going wrong!';
    const fakeRequest = makeFakeRequest();
    const deleteRequest = makeDeleteRequest({
      remove: () => {
        throw Error(expectedErrorMessage);
      },
    }, { info: () => 'Test log' });

    const fakeHttpRequest = {
      params: {
        id: fakeRequest.id,
      },
    };

    let actualErrorMessage;
    await deleteRequest(fakeHttpRequest).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });
});
