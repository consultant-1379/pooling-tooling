function makeGetTestEnvironmentsByPool(testEnvironmentDb, logger) {
  return async function getTestEnvironmentsByPool(httpRequest) {
    const { pool } = httpRequest.params;
    const retrievedTestEnvironments = await testEnvironmentDb.findBySearchQuery({
      pools: pool,
    }, 'testEnvironments');
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Test Environment (controller)',
      action: 'getTestEnvironmentsByPool',
      actionParameters: { PoolName: pool },
    };
    logger.info(loggingTags, `GET request to retrieve sorted Test Environments from pool "${pool}". \
${retrievedTestEnvironments.length} test environment(s) retrieved`);
    return retrievedTestEnvironments;
  };
}

module.exports = { makeGetTestEnvironmentsByPool };
