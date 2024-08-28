function makeDeleteRequest(requestsDb, logger) {
  return async function deleteRequest(httpRequest) {
    await requestsDb.remove({ id: httpRequest.params.id }, 'requests');
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Requests (controller)',
      action: 'deleteRequest',
      actionParameters: { RequestId: httpRequest.params.id },
    };
    logger.info(loggingTags, `DEL request to delete Request object with ID ${httpRequest.params.id}.`);
  };
}

module.exports = { makeDeleteRequest };
