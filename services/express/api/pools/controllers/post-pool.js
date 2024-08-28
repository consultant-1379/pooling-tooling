function makePostPool(createPool, poolsDb, httpServer, logger) {
  return async function postPool(httpRequest) {
    const { ...poolInfo } = httpRequest.body;
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Pools (controller)',
      action: 'postPool',
    };
    try {
      const poolWithSameName = await poolsDb.findBySearchQuery({ poolName: httpRequest.body.poolName }, 'pools');

      const createdPool = createPool(poolWithSameName, { ...poolInfo });

      const postedPool = await poolsDb.insert(createdPool, 'pools');

      if (httpServer.emitter) {
        httpServer.emitter.emit('poolEvent', 'pools table updated');
      }

      loggingTags.res = logger.logFormatter([postedPool]);
      loggingTags.actionParameters = { poolName: httpRequest.body.poolName };

      logger.info(loggingTags, `POST request to create Pool object with name:${httpRequest.body.poolName}.`);

      return postedPool;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}: ${error.message}`,
      );

      throw error;
    }
  };
}

module.exports = { makePostPool };
