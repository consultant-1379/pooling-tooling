const expect = require('expect');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makeRemoveTestEnvironmentIdFromPool } = require('../../use-cases/remove-test-environment-id-from-pool');

describe('Unit Test: (Test Environment service) Tests Remove test environment name from pool use case', () => {
  it('should throw an error if the pool passed in does not exist', () => {
    const removeTestEnvironmentIdFromPool = makeRemoveTestEnvironmentIdFromPool();
    expect(() => removeTestEnvironmentIdFromPool(undefined, 'testEnvironmentId')).toThrow(
      'Can\'t find pool attached to test environment when trying to remove test environment testEnvironmentId',
    );
  });

  it('should throw an error if the specified environment is not currently in the pool', () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: ['environmentOne'] });
    const removeTestEnvironmentIdFromPool = makeRemoveTestEnvironmentIdFromPool();
    expect(() => removeTestEnvironmentIdFromPool(fakePool, 'environmentTwo')).toThrow(
      `Test environment environmentTwo not in pool ${fakePool.poolName} and so can't remove from pool. Please investigate.`,
    );
  });

  it('should return an updated pool if changes to the assignedTestEnvironmentIds list are made', () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: ['testEnvironmentToRemoveFromPool'] });
    const removeTestEnvironmentIdFromPool = makeRemoveTestEnvironmentIdFromPool();
    const updatedPool = removeTestEnvironmentIdFromPool(fakePool, 'testEnvironmentToRemoveFromPool');
    expect(updatedPool.assignedTestEnvironmentIds).not.toContain('testEnvironmentToRemoveFromPool');
  });
});
