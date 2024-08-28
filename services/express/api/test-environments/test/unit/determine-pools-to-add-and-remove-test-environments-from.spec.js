const expect = require('expect');

const { makeAddOrRemoveTestEnvironmentFromPool } = require('../../use-cases/determine-pools-to-add-and-remove-test-environments-from');

describe('Unit Test: (Test Environment service) Tests determine pools to add and remove test environments from use case', () => {
  it('should correctly determine when a pool is added to an empty list of pools', () => {
    const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
    const addedOrRemovedTestEnvironmentsFromPool = addOrRemoveTestEnvironmentFromPool([], ['poolOne']);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToAddTestEnvironmentTo).toContain('poolOne');
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToRemoveTestEnvironmentFrom).toHaveLength(0);
  });

  it('should correctly determine when a pool is added to an existing list of pools', () => {
    const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
    const addedOrRemovedTestEnvironmentsFromPool = addOrRemoveTestEnvironmentFromPool(['poolOne'], ['poolOne', 'poolTwo']);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToAddTestEnvironmentTo).toContain('poolTwo');
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToRemoveTestEnvironmentFrom).toHaveLength(0);
  });

  it('should correctly determine when a pool is removed, leaving an empty list of pools', () => {
    const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
    const addedOrRemovedTestEnvironmentsFromPool = addOrRemoveTestEnvironmentFromPool(['poolOne'], []);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToAddTestEnvironmentTo).toHaveLength(0);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToRemoveTestEnvironmentFrom).toContain('poolOne');
  });

  it('should correctly determine when a pool is removed, leaving an existing pool', () => {
    const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
    const addedOrRemovedTestEnvironmentsFromPool = addOrRemoveTestEnvironmentFromPool(['poolOne', 'poolTwo'], ['poolOne']);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToAddTestEnvironmentTo).toHaveLength(0);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToRemoveTestEnvironmentFrom).toContain('poolTwo');
  });

  it('should correctly determine when both a pool is added and removed from a list of pools at the same time', () => {
    const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
    const addedOrRemovedTestEnvironmentsFromPool = addOrRemoveTestEnvironmentFromPool(['poolOne'], ['poolTwo']);
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToAddTestEnvironmentTo).toContain('poolTwo');
    expect(addedOrRemovedTestEnvironmentsFromPool.poolsToRemoveTestEnvironmentFrom).toContain('poolOne');
  });

  it('should correctly determine when no changes are made but the function is still called', () => {
    const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
    const addedOrRemovedTestEnvironmentsFromPoolOne = addOrRemoveTestEnvironmentFromPool(['poolOne'], ['poolOne']);
    expect(addedOrRemovedTestEnvironmentsFromPoolOne).toBeUndefined();

    const addedOrRemovedTestEnvironmentsFromPoolTwo = addOrRemoveTestEnvironmentFromPool([], []);
    expect(addedOrRemovedTestEnvironmentsFromPoolTwo).toBeUndefined();
  });
});
