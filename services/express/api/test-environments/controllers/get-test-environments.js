function makeGetTestEnvironments(testEnvironmentDb, logger) {
  return async function getTestEnvironments() {
    const retrievedTestEnvironments = await testEnvironmentDb.findAll('testEnvironments');
    const loggingTags = {
      req: {},
      res: {},
      service: 'Test Environment (controller)',
      action: 'getTestEnvironments',
      actionParameters: {},
    };
    logger.info(loggingTags, `GET request to retrieve all the Test Environment objects. \
${retrievedTestEnvironments.length} test environment(s) retrieved`);
    return retrievedTestEnvironments;
  };
}

module.exports = { makeGetTestEnvironments };
