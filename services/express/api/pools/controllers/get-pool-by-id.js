function makeGetPoolById(poolsDb, logger) {
  return async function getPoolById(httpRequest) {
    const retrievedPool = await poolsDb.findById(httpRequest.params.id, 'pools');
    const loggingTags = {
      req: httpRequest,
      res: logger.logFormatter(retrievedPool),
      service: 'Pools (controller)',
      action: 'getPoolById',
      actionParameters: { PoolId: httpRequest.params.id },
    };
    logger.info(loggingTags, `GET request to retrieve Pool object with ID:${httpRequest.params.id}.`);
    return retrievedPool;
  };
}

module.exports = { makeGetPoolById };
