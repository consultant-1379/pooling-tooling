const expect = require('expect');

const { deleteRequest } = require('../../controllers');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Requests service) Delete request', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });

  it('should successfully delete the correct request from the database', async () => {
    const fakeRequestOne = makeFakeRequest();
    await dbOperator.insert(fakeRequestOne, 'requests');

    await deleteRequest({ params: { id: fakeRequestOne.id } }, 'requests');

    const allRequests = await dbOperator.findAll('requests');
    expect(allRequests).toHaveLength(0);
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
