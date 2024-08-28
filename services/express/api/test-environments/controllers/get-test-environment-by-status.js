function makeGetTestEnvironmentsByStatus(testEnvironmentDb, logger) {
  return async function getTestEnvironmentsByStatus(httpRequest) {
    const { status } = httpRequest.params;
    const retrievedTestEnvironments = await testEnvironmentDb.findBySearchQuery({
      status,
    }, 'testEnvironments');
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Test Environment (controller)',
      action: 'getTestEnvironmentsByStatus',
      actionParameters: { TestEnvironmentStatus: status },
    };
    logger.info(loggingTags, `GET request to retrieve Test Environments objects with ${status} status. \
${retrievedTestEnvironments.length} test environment(s) retrieved`);
    return retrievedTestEnvironments;
  };
}

module.exports = { makeGetTestEnvironmentsByStatus };
