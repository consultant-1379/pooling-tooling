function makeGetRequests(requestsDb, logger) {
  return async function getRequests() {
    const requestsRetrieved = await requestsDb.findAll('requests');
    const loggingTags = {
      req: {},
      res: {},
      service: 'Requests (controller)',
      action: 'getRequests',
      actionParameters: {},
    };
    logger.info(loggingTags, 'GET request to retrieve all the Request objects.');
    return requestsRetrieved;
  };
}

module.exports = { makeGetRequests };
