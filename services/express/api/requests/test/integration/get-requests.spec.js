const expect = require('expect');

const { getRequests } = require('../../controllers');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Requests service) Get requests', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });

  it('should successfully get requests from the database', async () => {
    const fakeRequest = makeFakeRequest();
    await dbOperator.insert(fakeRequest, 'requests');
    const retrievedRequests = await getRequests();
    expect(retrievedRequests).toHaveLength(1);
  });

  it('should return an empty array from the database if there are no requests', async () => {
    const allRequests = await getRequests();
    expect(allRequests).toHaveLength(0);
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
