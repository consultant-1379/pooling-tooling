const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePatchRequestFromQueuedToAborted(
  dbOperator,
  requestService,
  logger,
) {
  return async function patchRequestFromQueuedToAborted(httpRequest) {
    const requestDataToEdit = {
      status: 'Aborted',
    };
    const { id } = httpRequest.params;

    const [retrievedRequest] = await dbOperator.findById(id, 'requests');

    const loggingTags = {
      req: httpRequest,
      res: {},
      changes: logger.logFormatter([requestDataToEdit]),
      old: logger.logFormatter([retrievedRequest]),
      service: 'Pipeline Functions (controller)',
      action: 'patchRequestFromQueuedToAborted',
      actionParameters: {},
    };

    if (!retrievedRequest || Object.keys(retrievedRequest).length === 0) {
      const errorInfo = {
        message: 'Retrieved request is undefined or the object is empty',
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw new NotFoundError(errorInfo.message);
    }

    loggingTags.actionParameters = { RequestId: id };

    const patchedRequest = requestService.updateRequest(
      retrievedRequest,
      requestDataToEdit,
    );
    const updatedRequest = await dbOperator.findOneAndUpdate(
      'requests',
      { _id: id },
      patchedRequest,
    );

    loggingTags.res = logger.logFormatter([updatedRequest]);
    logger.info(
      loggingTags,
      `PATCH request to update Request object status from Queued to Aborted with ID:${httpRequest.params.id}.`,
    );

    return updatedRequest;
  };
}

module.exports = { makePatchRequestFromQueuedToAborted };
