function makeGetRequest(requestsDb, logger) {
  return async function getRequest(httpRequest) {
    const retrievedRequest = await requestsDb.findById(httpRequest.params.id, 'requests');
    const loggingTags = {
      req: httpRequest,
      res: logger.logFormatter(retrievedRequest),
      service: 'Requests (controller)',
      action: 'getRequest',
      actionParameters: { RequestId: httpRequest.params.id },
    };
    logger.info(loggingTags, `GET request to retrieve Request object with ID:${httpRequest.params.id}.`);
    return retrievedRequest;
  };
}

module.exports = { makeGetRequest };
