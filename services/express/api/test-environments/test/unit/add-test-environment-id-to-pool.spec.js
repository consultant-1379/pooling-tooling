const expect = require('expect');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makeAddTestEnvironmentIdToPool } = require('../../use-cases/add-test-environment-id-to-pool');

describe('Unit Test: (Test Environment service) Tests add test environment id to pool use case', () => {
  it('should throw an error if the pool passed in does not exist', () => {
    const addTestEnvironmentIdToPool = makeAddTestEnvironmentIdToPool();
    expect(() => addTestEnvironmentIdToPool(undefined, ['testEnvironmentId'])).toThrow(
      'Can\'t find pool you wish to add test environment testEnvironmentId to.',
    );
  });

  it('should throw an error if the specified test environments id is already in the pool', () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: ['environmentOne'] });
    const addTestEnvironmentIdToPool = makeAddTestEnvironmentIdToPool();
    expect(() => addTestEnvironmentIdToPool(fakePool, 'environmentOne')).toThrow(
      `Attempting to add test environment environmentOne to pool ${fakePool.poolName} however it is already present in said pool.`,
    );
  });

  it('should return an updated pool if changes to the assignedTestEnvironmentIds list are required and made', () => {
    const fakePool = makeFakePool();
    const addTestEnvironmentIdToPool = makeAddTestEnvironmentIdToPool();
    const updatedPool = addTestEnvironmentIdToPool(fakePool, 'testEnvironmentToAddToPool');
    expect(updatedPool.assignedTestEnvironmentIds).toContain('testEnvironmentToAddToPool');
  });
});
