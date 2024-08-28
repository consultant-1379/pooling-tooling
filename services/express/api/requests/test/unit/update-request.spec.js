const expect = require('expect');

const { makeUpdateRequest } = require('../../use-cases/update-request');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { flattenObject } = require('../../../../utilities/index.js');
const { logger } = require('../../../../__test__/fixtures/logger.spec.js');

describe('Unit Test: (Request service) Update request use case', () => {
  it('mocks the update of a request', async () => {
    const fakeRequest = makeFakeRequest({ lastReservedAt: new Date(Date.now()) });

    const updateRequest = makeUpdateRequest(logger, flattenObject);

    const updatedRequest = await updateRequest(fakeRequest, { testEnvironmentId: 'abc' }).$set;

    expect(updatedRequest.testEnvironmentId).toEqual('abc');
  });

  it('should throw an error if there are no existing requests', () => {
    const updateRequest = makeUpdateRequest({ error: () => 'Test error log' }, flattenObject);
    expect(() => updateRequest(undefined, {})).toThrow('Request not found');
  });
});
