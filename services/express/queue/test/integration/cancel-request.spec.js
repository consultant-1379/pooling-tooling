const expect = require('expect');
const { cancelRequest } = require('../../use-cases');
const { dbOperator } = require('../../../data-access');
const { makeFakeRequest } = require('../../../__test__/fixtures/request.spec.js');

describe('Integration Test: (Queue service) Update status to \'Aborted\' for \'Queued\' requests which are canceled.', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
  });
  it('updates the status for a canceled request.', async () => {
    const fakeRequest = makeFakeRequest({ status: 'Queued' });
    await dbOperator.insert(fakeRequest, 'requests');
    await cancelRequest(fakeRequest);
    const [canceledRequest] = await dbOperator.findById(fakeRequest.id, 'requests');
    expect(canceledRequest.status).toEqual('Aborted');
  });
  after(async () => {
    await dbOperator.dropCollection('requests');
  });
});
