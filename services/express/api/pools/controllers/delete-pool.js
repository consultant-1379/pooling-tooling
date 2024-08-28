function makeDeletePool(ensureNoTestEnvironmentsAttachedToPool, poolsDb, httpServer, logger) {
  return async function deletePool(httpRequest) {
    const [poolToRemove] = await poolsDb.findById(httpRequest.params.id, 'pools');
    ensureNoTestEnvironmentsAttachedToPool(poolToRemove);
    await poolsDb.remove({ id: httpRequest.params.id }, 'pools');
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Pools (controller)',
      action: 'deletePool',
      actionParameters: { PoolId: httpRequest.params.id },
    };
    logger.info(loggingTags, `DEL request to remove Pool object with ID:${httpRequest.params.id}.`);
    if (httpServer.emitter) {
      httpServer.emitter.emit('poolEvent', 'pools table updated');
    }
  };
}

module.exports = { makeDeletePool };
