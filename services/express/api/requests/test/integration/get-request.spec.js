const expect = require('expect');

const { getRequest } = require('../../controllers');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Requests service) Get requests', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });

  it('should successfully get a request matching id from the database', async () => {
    const fakeRequestOne = makeFakeRequest();
    const fakeRequestTwo = makeFakeRequest();
    await dbOperator.insert(fakeRequestOne, 'requests');
    await dbOperator.insert(fakeRequestTwo, 'requests');

    const [requestMatchingId] = await getRequest({
      params: { id: fakeRequestTwo.id },
    });
    expect(requestMatchingId).toStrictEqual(fakeRequestTwo);
  });

  it('should return an empty array from the database if the request does not exist', async () => {
    const requestMatchingId = await getRequest({
      params: { id: 'NON-EXISTENT-ID' },
    });
    expect(requestMatchingId).toHaveLength(0);
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
