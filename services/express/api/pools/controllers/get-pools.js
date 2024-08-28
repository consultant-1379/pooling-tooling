function makeGetPools(poolsDb, logger) {
  return async function getPools() {
    const poolsRetrieved = await poolsDb.findAll('pools');
    const loggingTags = {
      req: {},
      res: {},
      service: 'Pools (controller)',
      action: 'getPools',
      actionParameters: {},
    };
    logger.info(loggingTags, `GET request to retrieve all the Pool objects. \
${poolsRetrieved.length} pool(s) retrieved`);
    return poolsRetrieved;
  };
}

module.exports = { makeGetPools };
