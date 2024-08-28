const { BadRequestError } = require('../../../interfaces/BadRequestError');
const { ConflictError } = require('../../../interfaces/ConflictError');

function makeCreateTestEnvironment(createTestEnvironment, logger) {
  return function addTestEnvironment(testEnvironmentWithSameNameAsTestEnvironmentInfo, testEnvironmentInfo) {
    const loggingTags = {
      service: 'Test Environment (use-cases)',
      action: 'addTestEnvironment',
      actionParameters: {},
    };
    if (!testEnvironmentInfo) {
      const errorInfo = {
        message: 'Test Environment information is empty',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    if (testEnvironmentWithSameNameAsTestEnvironmentInfo.length > 0) {
      const errorInfo = {
        message: `A test environment named ${testEnvironmentInfo.name} already exists. Not creating new test environment.`,
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new ConflictError(errorInfo.message);
    }

    const createdTestEnvironment = createTestEnvironment(testEnvironmentInfo);

    logger.info(loggingTags, `Test Environment object with name:${createdTestEnvironment.getName()} is successfully created.`);

    return {
      id: createdTestEnvironment.getId(),
      name: createdTestEnvironment.getName(),
      status: createdTestEnvironment.getStatus(),
      requestId: createdTestEnvironment.getRequestId(),
      pools: createdTestEnvironment.getPools(),
      properties: createdTestEnvironment.getProperties(),
      stage: createdTestEnvironment.getStage(),
      additionalInfo: createdTestEnvironment.getAdditionalInfo(),
      comments: createdTestEnvironment.getComments(),
      priorityInfo: createdTestEnvironment.getPriorityInfo(),
      createdOn: new Date(createdTestEnvironment.getCreatedOn()),
      modifiedOn: new Date(createdTestEnvironment.getModifiedOn()),
    };
  };
}

module.exports = { makeCreateTestEnvironment };
