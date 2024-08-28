const expect = require('expect');

const { patchRequest } = require('../../controllers');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Requests service) Patch request', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });

  it('should successfully patch a request in the database', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Available' });
    await dbOperator.insert(fakeRequest, 'requests');

    const requestUpdates = {
      body: { status: 'Reserved' },
      params: { id: fakeRequest.id },
    };
    const patchedRequest = await patchRequest(requestUpdates);

    expect(patchedRequest.status).toEqual('Reserved');
  });

  it('should not modify a request in the database if an error is thrown in the e2e flow of request modification', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Available' });
    await dbOperator.insert(fakeRequest, 'requests');

    const requestUpdates = {
      body: { status: 'THIS_IS_NOT_VALID' },
      params: { id: fakeRequest.id },
    };

    const expectedErrorMessage = 'Invalid status \'THIS_IS_NOT_VALID\' provided when making request';
    let actualErrorMessage;
    await patchRequest(requestUpdates).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
