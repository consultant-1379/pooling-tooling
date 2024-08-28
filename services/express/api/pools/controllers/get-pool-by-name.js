const { ConflictError } = require('../../../interfaces/ConflictError');

function makeGetPoolByName(poolDb, logger) {
  return async function getPoolByName(httpRequest) {
    const poolName = httpRequest.params.name;
    const retrievedPools = await poolDb.findBySearchQuery({
      poolName,
    }, 'pools');

    const loggingTags = {
      req: httpRequest,
      res: logger.logFormatter(retrievedPools),
      service: 'Pools (controller)',
      action: 'getPoolByName',
      actionParameters: { PoolName: poolName },
    };

    if (retrievedPools.length > 1) {
      const errorInfo = {
        message: `More than one Pool found with name ${poolName}.`,
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new ConflictError(errorInfo.message);
    }

    logger.info(loggingTags, 'GET request to retrieve Pool object by name.');

    return retrievedPools;
  };
}

module.exports = { makeGetPoolByName };
