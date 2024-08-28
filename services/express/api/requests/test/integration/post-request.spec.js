const expect = require('expect');

const { postRequest } = require('../../controllers');
const { makeFakeRequest } = require('../../../../__test__/fixtures/request.spec.js');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { dbOperator } = require('../../../../data-access');

describe('Integration Test: (Requests service) Create request', () => {
  beforeEach(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('pools');
  });

  it('should successfully create a request in the database', async () => {
    const fakeRequest = makeFakeRequest({ poolName: 'fakePool', requestTimeout: 620000 });
    const fakePool = makeFakePool({ poolName: 'fakePool' });
    await dbOperator.insert(fakePool, 'pools');
    const postedRequest = await postRequest({ body: fakeRequest });
    expect(postedRequest.id).toEqual(fakeRequest.id);
    const allRequests = await dbOperator.findAll('requests');
    expect(allRequests).toHaveLength(1);
  });

  it('should not create a request in the database if an error is thrown in the e2e flow of request creation', async () => {
    const fakeRequest = makeFakeRequest({ id: 'INVALID', poolName: 'fakePool' });
    const fakePool = makeFakePool({ poolName: 'fakePool' });
    await dbOperator.insert(fakePool, 'pools');
    const expectedErrorMessage = 'Request entity must have a valid id.';
    let actualErrorMessage;
    await postRequest({ body: fakeRequest }).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
    const allRequests = await dbOperator.findAll('requests');
    expect(allRequests).toHaveLength(0);
  });

  it('should not create a request in the database if theres no matching pool name in RPT', async () => {
    const fakeRequest = makeFakeRequest({ poolName: 'fakePool' });
    const expectedErrorMessage = 'No pool in RPT with name: fakePool';
    let actualErrorMessage;
    await postRequest({ body: fakeRequest }).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
    const allRequests = await dbOperator.findAll('requests');
    expect(allRequests).toHaveLength(0);
  });

  it('should not create a request if the requestTimeout is less than a minute.', async () => {
    const fakeRequest = makeFakeRequest({ poolName: 'fakePool', requestTimeout: 59999 });
    const fakePool = makeFakePool({ poolName: 'fakePool' });
    await dbOperator.insert(fakePool, 'pools');
    const expectedErrorMessage = 'The timeout can not be less than a minute.';
    let actualErrorMessage;
    await postRequest({ body: fakeRequest }).catch((error) => {
      actualErrorMessage = error.message;
    })
      .then(() => {
        expect(actualErrorMessage).toBe(expectedErrorMessage);
      });
    const allRequests = await dbOperator.findAll('requests');
    expect(allRequests).toHaveLength(0);
  });

  after(async () => {
    await dbOperator.dropCollection('requests');
    await dbOperator.dropCollection('pools');
  });
});
