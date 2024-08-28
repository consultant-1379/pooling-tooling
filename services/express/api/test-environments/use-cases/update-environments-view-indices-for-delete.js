const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makeUpdateEnvironmentsViewIndices(updateViewIndices) {
  return function updateEnvironmentsViewIndices(environments, testEnvironmentToBeRemoved) {
    if (!environments) {
      throw new NotFoundError(
        `Can't find test environments when trying to reorder indices for removal of test environment ${testEnvironmentToBeRemoved.id}`,
      );
    }
    return updateViewIndices(environments, 'testEnvironmentViewIndex', testEnvironmentToBeRemoved.priorityInfo.viewIndices.testEnvironmentViewIndex);
  };
}

module.exports = { makeUpdateEnvironmentsViewIndices };
