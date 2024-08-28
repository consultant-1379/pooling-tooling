const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { ConflictError } = require('../../../interfaces/ConflictError');

function makeEnsureNoTestEnvironmentsAttachedToPool() {
  return function ensureNoTestEnvironmentsAttachedToPool(poolToRemove) {
    if (!poolToRemove) {
      throw new BadRequestError('No pool provided when checking if there are test environments attached to pool');
    }
    if (poolToRemove.assignedTestEnvironmentIds.length > 0) {
      throw new ConflictError(`There are currently test environments attached to pool ${
        poolToRemove.poolName}. Assign said test environments to another pool before deleting the current one.`);
    }
  };
}

module.exports = { makeEnsureNoTestEnvironmentsAttachedToPool };
