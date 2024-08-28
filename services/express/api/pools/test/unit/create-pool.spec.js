const expect = require('expect');

const { makeCreatePool } = require('../../use-cases/create-pool');
const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');

describe('Unit Test: (Pool service) Create pool use case', () => {
  it('must throw the appropriate error if poolInfo is empty', () => {
    const fakePool = null;
    const createPool = makeCreatePool(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    expect(() => createPool([fakePool], fakePool)).toThrow(
      'Pool information is empty',
    );
  });

  it('must throw the appropriate error if pool already exists', () => {
    const fakePoolName = 'pool1';
    const fakePool = makeFakePool({ poolName: fakePoolName });
    const createPool = makeCreatePool(() => true, { info: () => 'Test log', error: () => 'Test error log' });
    expect(() => createPool([fakePool], fakePool)).toThrow(
      `A pool named ${fakePoolName} already exists. Not creating new pool with the same name.`,
    );
  });

  it('mocks the creation of a pool', () => {
    const fakePool = makeFakePool();
    const fakeCreatedPool = Object.freeze({
      getId: () => fakePool.id,
      getAssignedTestEnvironmentIds: () => fakePool.assignedTestEnvironmentIds,
      getPoolName: () => fakePool.poolName,
      getCreatorDetails: () => fakePool.creatorDetails,
      getAdditionalInfo: () => fakePool.additionalInfo,
      getCreatedOn: () => new Date(fakePool.createdOn),
      getModifiedOn: () => new Date(fakePool.modifiedOn),
    });
    const createPool = makeCreatePool(() => fakeCreatedPool, { info: () => 'Test log', error: () => 'Test error log' });

    const createdPool = createPool([], fakePool);

    expect(createdPool).toEqual(fakePool);
  });
});
