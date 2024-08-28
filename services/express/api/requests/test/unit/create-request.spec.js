const expect = require('expect');

const { makeCreateRequest } = require('../../use-cases/create-request');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');

describe('Unit Test: (Request service) Create request use case', () => {
  it('mocks the create of a request', async () => {
    const fakeRequest = makeFakeRequest();
    const fakeCreatedRequest = Object.freeze({
      getId: () => fakeRequest.id,
      getTestEnvironmentId: () => fakeRequest.testEnvironmentId,
      getPoolName: () => fakeRequest.poolName,
      getRequestorDetails: () => fakeRequest.requestorDetails,
      getStatus: () => fakeRequest.status,
      getRequestTimeout: () => fakeRequest.requestTimeout,
      getCreatedOn: () => fakeRequest.createdOn,
      getModifiedOn: () => fakeRequest.modifiedOn,
    });
    const createRequest = makeCreateRequest(() => fakeCreatedRequest, { info: () => 'Test log', error: () => 'Test error log' });

    const createdRequest = await createRequest(fakeRequest);

    expect(createdRequest).toEqual(fakeRequest);
  });

  it('throws error if no request info is provided', async () => {
    const expectedErrorMessage = 'Request information is empty';
    const createRequest = makeCreateRequest(() => {}, { info: () => 'Test log', error: () => 'Test error log' });
    expect(() => createRequest(undefined)).toThrow(expectedErrorMessage);
  });
});
