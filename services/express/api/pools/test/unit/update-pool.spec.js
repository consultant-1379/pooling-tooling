const expect = require('expect');

const { makeUpdatePool } = require('../../use-cases/update-pool');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { flattenObject } = require('../../../../utilities');

const logger = { info: () => 'Test log', error: () => 'Test log' };

describe('Unit Test: (Pool service) Update pool use case', () => {
  it('should throw an error if no Pool is found', () => {
    expect(() => makeUpdatePool(null).toThrow('Pool not found'));
  });

  it('updates a pool name', () => {
    const fakePool = makeFakePool();
    const updatePool = makeUpdatePool(logger, flattenObject);
    const name = 'abc';
    const updates = updatePool([fakePool], { poolName: name });
    expect(updates.$set.poolName).toEqual(name);
    expect(updates.$set.modifiedOn).toBeTruthy();
  });

  it('updates a pool entity', () => {
    const originalPool = makeFakePool();
    const patchPool = makeFakePool();
    const updatePool = makeUpdatePool(logger, flattenObject);
    const updates = updatePool([originalPool], patchPool).$set;

    expect(updates.id).toBe(undefined);
    expect(updates.modifiedOn).toBeTruthy();
    expect(updates.additionalInfo).toEqual(patchPool.additionalInfo);
    expect(updates.poolName).toEqual(patchPool.poolName);
    expect(updates['creatorDetails.area']).toEqual(
      patchPool.creatorDetails.area,
    );
    expect(updates['creatorDetails.name']).toEqual(
      patchPool.creatorDetails.name,
    );
    expect(updates.creatorDetails).toBeFalsy();
    expect(updates.createdOn).toBeFalsy();
    expect(updates.assignedTestEnvironmentIds).toEqual(
      patchPool.assignedTestEnvironmentIds,
    );
  });

  it('pushes and pulls testEnvironmentIds', () => {
    const originalPool = makeFakePool();
    const testEnvironmentIdsToRemove = originalPool.assignedTestEnvironmentIds;
    const testEnvironmentIdsToAdd = ['clp774tky002eyem02qjohr14'];
    const updatePool = makeUpdatePool(logger, flattenObject);
    const updates = updatePool([originalPool], {
      ...{ testEnvironmentIdsToRemove },
      ...{ testEnvironmentIdsToAdd },
    });
    expect(updates.$pull.assignedTestEnvironmentIds.$in).toStrictEqual(
      testEnvironmentIdsToRemove,
    );
    expect(updates.$push.assignedTestEnvironmentIds.$each).toStrictEqual(
      testEnvironmentIdsToAdd,
    );
  });

  it('throws an error if assignedTestEnvironmentIds is an empty array', () => {
    const originalPool = makeFakePool();
    originalPool.assignedTestEnvironmentIds = [];
    const updatePool = makeUpdatePool(logger, flattenObject);
    expect(() => updatePool([originalPool], { assignedTestEnvironmentIds: [] })).toThrowError(
      'Pool entity must use array for assignedTestEnvironmentIds.',
    );
  });
});
