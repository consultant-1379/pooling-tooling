const { BadRequestError } = require('../../../interfaces/BadRequestError');

function makeReserveFreshestAvailableTestEnvironmentInPool(poolsDb, createQueryToSearchAvailableTestEnvironments,
  getFreshestTestEnvironment, patchTestEnvironment, logger) {
  return async function reserveFreshestAvailableTestEnvironmentInPool(poolName, requestId, requestorName) {
    const loggingTags = {
      service: 'Pools (controller)',
      action: 'reserveFreshestAvailableTestEnvironmentInPool',
      actionParameters: {
        PoolName: poolName,
        RequestId: requestId,
        RequestorName: requestorName,
      },
    };
    if (!poolName || !requestorName || !requestId) {
      const errorInfo = {
        message: 'No pool name, requestor name or request ID provided',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    const [pool] = await poolsDb.findBySearchQuery({ poolName }, 'pools');

    if (pool.assignedTestEnvironmentIds.length === 0) {
      return `No test environments exist in the ${poolName} pool`;
    }

    const testEnvironmentIdsToSearch = pool.assignedTestEnvironmentIds;

    const searchQuery = {
      _id: testEnvironmentIdsToSearch,
      status: 'Available',
    };

    const finalQuery = await createQueryToSearchAvailableTestEnvironments(searchQuery);

    const availableTestEnvironments = await poolsDb.findBySearchQuery(finalQuery, 'testEnvironments');

    if (availableTestEnvironments.length < 1) {
      return `No available test environments in the ${poolName} pool`;
    }

    const availableTestEnvironmentIds = [];

    for (const availableTestEnvironment of availableTestEnvironments) {
      const availableTestEnvironmentId = availableTestEnvironment.id;
      availableTestEnvironmentIds.push(availableTestEnvironmentId);
    }

    const freshestAvailableTestEnvironment = await getFreshestTestEnvironment(availableTestEnvironmentIds);

    const patchedTestEnvironment = await patchTestEnvironment({
      params: { id: freshestAvailableTestEnvironment.id },
      body: {
        status: 'Reserved',
        requestId,
        additionalInfo: `Reserved by ${requestorName}`,
      },
    });

    logger.info(loggingTags, `Test Environment "${patchedTestEnvironment.name}" is reserved from "${poolName}" pool.`);
    return patchedTestEnvironment;
  };
}

module.exports = { makeReserveFreshestAvailableTestEnvironmentInPool };
