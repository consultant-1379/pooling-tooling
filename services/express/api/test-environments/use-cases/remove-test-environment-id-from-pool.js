const { ConflictError } = require('../../../interfaces/ConflictError');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeRemoveTestEnvironmentIdFromPool() {
  return function removeTestEnvironmentIdFromPool(poolInformationToRemoveTestEnvironmentFrom, testEnvironmentId) {
    if (!poolInformationToRemoveTestEnvironmentFrom) {
      throw new NotFoundError(`Can't find pool attached to test environment when trying to remove test environment ${testEnvironmentId}`);
    }
    const testEnvironmentsInPool = poolInformationToRemoveTestEnvironmentFrom.assignedTestEnvironmentIds;
    if (!testEnvironmentsInPool.includes(testEnvironmentId)) {
      throw new ConflictError(`Test environment ${testEnvironmentId} not in pool ${
        poolInformationToRemoveTestEnvironmentFrom.poolName} and so can't remove from pool. Please investigate.`);
    } else {
      const indexOfTestEnvironmentToRemove = poolInformationToRemoveTestEnvironmentFrom.assignedTestEnvironmentIds.indexOf(testEnvironmentId);
      poolInformationToRemoveTestEnvironmentFrom.assignedTestEnvironmentIds.splice(indexOfTestEnvironmentToRemove, 1);
      return poolInformationToRemoveTestEnvironmentFrom;
    }
  };
}

module.exports = { makeRemoveTestEnvironmentIdFromPool };
