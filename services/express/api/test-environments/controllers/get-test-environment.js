function makeGetTestEnvironment(testEnvironmentDb, logger) {
  return async function getTestEnvironment(httpRequest) {
    const retrievedTestEnvironment = await testEnvironmentDb.findById(httpRequest.params.id, 'testEnvironments');
    const loggingTags = {
      req: httpRequest,
      res: logger.logFormatter(retrievedTestEnvironment),
      service: 'Test Environment (controller)',
      action: 'getTestEnvironmentById',
      actionParameters: { TestEnvironmentId: httpRequest.params.id },
    };
    logger.info(loggingTags, `GET request to retrieve Test Environment object with ID:${httpRequest.params.id}.`);
    return retrievedTestEnvironment;
  };
}

module.exports = { makeGetTestEnvironment };
