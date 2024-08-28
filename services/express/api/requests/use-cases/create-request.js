const { BadRequestError } = require('../../../interfaces/BadRequestError');

function makeCreateRequest(createRequest, logger) {
  return function addRequest(requestInfo) {
    const loggingTags = {
      service: 'Request (use-cases)',
      action: 'addRequest',
      actionParameters: {},
    };

    if (!requestInfo) {
      const errorInfo = {
        message: 'Request information is empty',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    const createdRequest = createRequest(requestInfo);

    logger.info(loggingTags, `Request entity with ID:${createdRequest.getId()} was successfully created.`);

    return {
      id: createdRequest.getId(),
      testEnvironmentId: createdRequest.getTestEnvironmentId(),
      poolName: createdRequest.getPoolName(),
      requestorDetails: createdRequest.getRequestorDetails(),
      status: createdRequest.getStatus(),
      requestTimeout: createdRequest.getRequestTimeout(),
      createdOn: new Date(createdRequest.getCreatedOn()),
      modifiedOn: new Date(createdRequest.getModifiedOn()),
    };
  };
}

module.exports = { makeCreateRequest };
