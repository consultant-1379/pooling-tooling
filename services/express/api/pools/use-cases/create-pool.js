const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { ConflictError } = require('../../../interfaces/ConflictError');

function makeCreatePool(createPool, logger) {
  return function addPool(poolWithSameNameAsPoolInfo, poolInfo) {
    const loggingTags = {
      service: 'Pools (use-cases)',
      action: 'addPool',
      actionParameters: {},
    };
    if (!poolInfo) {
      const errorInfo = {
        message: 'Pool information is empty',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    if (poolWithSameNameAsPoolInfo.length > 0) {
      const errorInfo = {
        message: `A pool named ${poolInfo.poolName} already exists. Not creating new pool with the same name.`,
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new ConflictError(errorInfo.message);
    }

    const createdPool = createPool(poolInfo);

    logger.info(loggingTags, `Pool object with name:${createdPool.getPoolName()} is successfully created.`);

    return {
      id: createdPool.getId(),
      assignedTestEnvironmentIds: createdPool.getAssignedTestEnvironmentIds(),
      poolName: createdPool.getPoolName(),
      creatorDetails: createdPool.getCreatorDetails(),
      additionalInfo: createdPool.getAdditionalInfo(),
      createdOn: new Date(createdPool.getCreatedOn()),
      modifiedOn: new Date(createdPool.getModifiedOn()),
    };
  };
}

module.exports = { makeCreatePool };
