const { ConflictError } = require('../../../interfaces/ConflictError');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeAddTestEnvironmentIdToPool() {
  return function addTestEnvironmentIdToPool(poolInformationToAddTestEnvironmentTo, testEnvironmentId) {
    if (!poolInformationToAddTestEnvironmentTo) {
      throw new NotFoundError(`Can't find pool you wish to add test environment ${testEnvironmentId} to.`);
    }
    const testEnvironmentsInPool = poolInformationToAddTestEnvironmentTo.assignedTestEnvironmentIds;
    if (testEnvironmentsInPool.includes(testEnvironmentId)) {
      throw new ConflictError(`Attempting to add test environment ${testEnvironmentId} to pool ${
        poolInformationToAddTestEnvironmentTo.poolName} however it is already present in said pool.`);
    } else {
      poolInformationToAddTestEnvironmentTo.assignedTestEnvironmentIds.push(testEnvironmentId);
      return poolInformationToAddTestEnvironmentTo;
    }
  };
}

module.exports = { makeAddTestEnvironmentIdToPool };
