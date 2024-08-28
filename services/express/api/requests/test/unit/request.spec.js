const expect = require('expect');

const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { makeRequest } = require('../../entities');

describe('Unit Test: (Request service) Request entity', () => {
  it('must create a request successfully', () => {
    const fakeRequest = makeFakeRequest({ status: 'Reserved' });
    const createdRequest = makeRequest(fakeRequest);
    expect(createdRequest.getId()).toBe(fakeRequest.id);
    expect(createdRequest.getTestEnvironmentId()).toBe(fakeRequest.testEnvironmentId);
    expect(createdRequest.getPoolName()).toBe(fakeRequest.poolName);
    expect(createdRequest.getRequestorDetails()).toBe(fakeRequest.requestorDetails);
    expect(createdRequest.getStatus()).toBe(fakeRequest.status);
    expect(createdRequest.getCreatedOn()).toBeDefined();
    expect(createdRequest.getModifiedOn()).toBeDefined();
  });

  it('must not create a request with an invalid ID', () => {
    const requestInvalidId = makeFakeRequest({ id: 'invalid' });
    expect(() => makeRequest(requestInvalidId)).toThrow('Request entity must have a valid id.');
    const requestNoId = makeFakeRequest({ id: null });
    expect(() => makeRequest(requestNoId)).toThrow('Request entity must have a valid id.');
  });

  it('must not create a request without all required properties', () => {
    const expectedErrorMessage = 'When making a request, not every required property was provided.';
    let fakeRequest = makeFakeRequest({ poolName: null });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
    fakeRequest = makeFakeRequest({ requestorDetails: null });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
    fakeRequest = makeFakeRequest({ status: null });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
  });

  it('must not create a request with an invalid status', () => {
    const expectedErrorMessage = 'Invalid status \'invalidStatus\' provided when making request';
    const fakeRequest = makeFakeRequest({ status: 'invalidStatus' });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
  });

  it('must not create a request with invalid requestor details', () => {
    const expectedErrorMessage = 'Invalid Requestor Details provided when making request';
    const fakeRequest = makeFakeRequest({ requestorDetails: { invalid: 'property' } });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
  });

  it('must not create a queued request with test environment id', () => {
    const expectedErrorMessage = 'When creating a queued request, you must not specify an Environment ID.';
    const fakeRequest = makeFakeRequest({
      status: 'Queued',
      testEnvironmentId: 'emesdel',
    });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
  });

  it('must not create a request if the requestTimeout is less than a minute.', () => {
    const expectedErrorMessage = 'The timeout can not be less than a minute.';
    const fakeRequest = makeFakeRequest({ requestTimeout: 59999 });
    expect(() => makeRequest(fakeRequest)).toThrow(expectedErrorMessage);
  });
});
