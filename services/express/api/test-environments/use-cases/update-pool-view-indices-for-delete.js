const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeUpdatePoolsViewIndices(updateViewIndices) {
  return function updatePoolViewIndices(environments, poolName, testEnvironmentToBeRemoved) {
    if (!environments) {
      throw new NotFoundError(
        `Can't find environments in pool: ${poolName} when reordering indices for removal of test environment ${testEnvironmentToBeRemoved.id}`,
      );
    }
    return updateViewIndices(environments, poolName, testEnvironmentToBeRemoved.priorityInfo.viewIndices[poolName]);
  };
}

module.exports = { makeUpdatePoolsViewIndices };
