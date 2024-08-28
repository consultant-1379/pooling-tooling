const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchPool(modifyPool, poolDb, httpServer, logger) {
  return async function patchPool(httpRequest) {
    const changes = httpRequest.body;
    const { id } = httpRequest.params;
    const loggingTags = {
      req: httpRequest,
      res: {},
      changes: logger.logFormatter([changes]),
      service: 'Pools (controller)',
      action: 'patchPool',
      actionParameters: {},
    };
    try {
      const existingPool = await poolDb.findById(id, 'pools');
      if (!existingPool) {
        throw new NotFoundError('Pool not found');
      }
      loggingTags.old = logger.logFormatter([existingPool]);
      loggingTags.actionParameters = { PoolName: existingPool.name };

      const updatedChanges = modifyPool(existingPool, changes);
      loggingTags.res = logger.logFormatter([updatedChanges]);

      const result = await poolDb.findOneAndUpdate(
        'pools',
        { _id: id },
        updatedChanges,
      );

      if (httpServer.emitter) {
        httpServer.emitter.emit('poolEvent', 'pools table updated');
      }
      logger.info(
        loggingTags,
        `PATCH request to update Pool object with name:${existingPool.name}.`,
      );
      return result;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makePatchPool };
