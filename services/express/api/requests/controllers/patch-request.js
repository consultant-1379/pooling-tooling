function makePatchRequest(modifyRequest, requestDb, logger) {
  return async function patchRequest(httpRequest) {
    const changes = httpRequest.body;
    const { id } = httpRequest.params;
    const loggingTags = {
      req: httpRequest,
      changes: logger.logFormatter([changes]),
      service: 'Requests (controller)',
      action: 'patchRequest',
      actionParameters: { RequestId: id },
    };
    try {
      const [existingRequest] = await requestDb.findById(id, 'requests');
      loggingTags.old = logger.logFormatter([existingRequest]);

      const updatedChanges = modifyRequest(existingRequest, changes);

      const updatedRequest = await requestDb.findOneAndUpdate(
        'requests',
        { _id: id },
        updatedChanges,
      );
      loggingTags.res = logger.logFormatter([updatedRequest]);

      logger.info(
        loggingTags,
        `PATCH request to update Request object with ID:${id}.`,
      );

      return updatedRequest;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };
      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`,
      );
      throw error;
    }
  };
}

module.exports = { makePatchRequest };
