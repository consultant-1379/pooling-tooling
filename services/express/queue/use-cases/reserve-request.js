function makeReserveRequest(
  logger,
  dbOperator,
  reserveFreshestAvailableTestEnvironmentInPool,
  updateRequest,
) {
  return async function reserveRequest(queuedRequest) {
    const freshestAvailableEnvironment = await reserveFreshestAvailableTestEnvironmentInPool(
      queuedRequest.poolName,
      queuedRequest.id,
      queuedRequest.requestorDetails.name,
    );
    if (typeof freshestAvailableEnvironment === 'object' && freshestAvailableEnvironment !== null) {
      const updatedRequest = updateRequest(queuedRequest, {
        testEnvironmentId: freshestAvailableEnvironment.id,
        status: 'Reserved',
      });
      await dbOperator.findOneAndUpdate(
        'requests',
        { _id: queuedRequest.id },
        updatedRequest,
      );
      const loggingTags = {
        service: 'Queue (use-case)',
        action: 'reserveRequest',
        actionParameters: { queuedRequest: queuedRequest.id },
      };
      logger.info(loggingTags, `Request with ID: ${queuedRequest.id} is set to status: 'Reserved'`);
    }
  };
}

module.exports = { makeReserveRequest };
