const { ConflictError } = require('../../../interfaces/ConflictError');

function makeGetTestEnvironmentByName(testEnvironmentDb, logger) {
  return async function getTestEnvironment(httpRequest) {
    const testEnvironmentName = httpRequest.params.name;
    const retrievedTestEnvironments = await testEnvironmentDb.findBySearchQuery({
      name: testEnvironmentName,
    }, 'testEnvironments');

    const loggingTags = {
      req: httpRequest,
      res: logger.logFormatter(retrievedTestEnvironments),
      service: 'Test Environment (controller)',
      action: 'getTestEnvironmentByName',
      actionParameters: { TestEnvironmentName: testEnvironmentName },
    };

    if (retrievedTestEnvironments.length > 1) {
      const errorInfo = {
        message: 'More than one Test Environment found with same name. Please contact Thunderbee',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new ConflictError(errorInfo.message);
    }

    logger.info(loggingTags, 'GET request to retrieve Test Environment object by name.');
    return retrievedTestEnvironments;
  };
}

module.exports = { makeGetTestEnvironmentByName };
