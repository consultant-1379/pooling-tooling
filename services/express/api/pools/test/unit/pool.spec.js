const expect = require('expect');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makePool } = require('../../entities');

describe('Unit Test: (Pool service) Pool entity', () => {
  it('must create a pool successfully', () => {
    const fakePool = makeFakePool();
    const createdPool = makePool(fakePool);
    expect(createdPool.getId()).toBe(fakePool.id);
    expect(createdPool.getAssignedTestEnvironmentIds()).toBe(fakePool.assignedTestEnvironmentIds);
    expect(createdPool.getPoolName()).toBe(fakePool.poolName);
    expect(createdPool.getCreatorDetails()).toBe(fakePool.creatorDetails);
    expect(createdPool.getAdditionalInfo()).toBe(fakePool.additionalInfo);
    expect(createdPool.getCreatedOn()).toBeDefined();
    expect(createdPool.getModifiedOn()).toBeDefined();
  });

  it('must not create a pool with an invalid ID', () => {
    const poolInvalidId = makeFakePool({ id: 'invalid' });
    expect(() => makePool(poolInvalidId)).toThrow('Pool entity must have a valid id.');
    const poolNoId = makeFakePool({ id: null });
    expect(() => makePool(poolNoId)).toThrow('Pool entity must have a valid id.');
  });

  it('must not create a pool where assignedTestEnvironments is not an array.', () => {
    const expectedErrorMessage = 'Pool entity must use array for assignedTestEnvironmentIds.';
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: { id1: '297', id2: '306' } });
    expect(() => makePool(fakePool)).toThrow(expectedErrorMessage);
  });

  it('must not create a pool without all required properties', () => {
    const expectedErrorMessage = 'When making a pool, not every required property was provided.';
    let fakePool = makeFakePool({ poolName: null });
    expect(() => makePool(fakePool)).toThrow(expectedErrorMessage);
    fakePool = makeFakePool({ creatorDetails: null });
    expect(() => makePool(fakePool)).toThrow(expectedErrorMessage);
  });

  it('must not create a pool with invalid creator details', () => {
    const expectedErrorMessage = 'Invalid Creator Details provided when making pool';
    const fakePool = makeFakePool({ creatorDetails: { invalid: 'property' } });
    expect(() => makePool(fakePool)).toThrow(expectedErrorMessage);
  });
});
