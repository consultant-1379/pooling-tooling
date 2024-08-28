const expect = require('expect');

const { makeFakePool } = require('../../../../__test__/fixtures/pool.spec.js');
const { makeEnsureNoTestEnvironmentsAttachedToPool } = require('../../use-cases/ensure-no-test-environments-attached-to-pool');

describe('Unit Test: (Pool service) Ensure no test environments attached to pool use case', () => {
  it('should throw an error if no pool was passed in to use case', () => {
    const ensureNoTestEnvironmentsAttachedToPool = makeEnsureNoTestEnvironmentsAttachedToPool();
    expect(() => ensureNoTestEnvironmentsAttachedToPool(undefined)).toThrow('No pool provided when checking if there are test environments attached to pool');
  });

  it('should throw an error there are test environments attached to the pool trying to be removed', () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: ['ATLEASTONEINLIST'] });
    const ensureNoTestEnvironmentsAttachedToPool = makeEnsureNoTestEnvironmentsAttachedToPool();
    expect(() => ensureNoTestEnvironmentsAttachedToPool(fakePool)).toThrow(
      `There are currently test environments attached to pool ${
        fakePool.poolName}. Assign said test environments to another pool before deleting the current one.`,
    );
  });

  it('should do nothing if there are no test environments attached to the pool trying to be removed', () => {
    const fakePool = makeFakePool({ assignedTestEnvironmentIds: [] });
    const ensureNoTestEnvironmentsAttachedToPool = makeEnsureNoTestEnvironmentsAttachedToPool();
    const testEnvironmentsAttachedToPool = ensureNoTestEnvironmentsAttachedToPool(fakePool);
    expect(testEnvironmentsAttachedToPool).toBe(undefined);
  });
});
