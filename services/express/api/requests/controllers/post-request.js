const { NotFoundError } = require('../../../interfaces/NotFoundError');

function makePostRequest(createRequest, dbOperator, logger) {
  return async function postRequest(httpRequest) {
    const { ...requestInfo } = httpRequest.body;
    const loggingTags = {
      req: httpRequest,
      res: {},
      service: 'Requests (controller)',
      action: 'postRequest',
      actionParameters: {},
    };
    try {
      const [pool] = await dbOperator.findBySearchQuery({ poolName: httpRequest.body.poolName }, 'pools');

      if (!pool) {
        throw new NotFoundError(`No pool in RPT with name: ${httpRequest.body.poolName}`);
      }

      const createdRequest = createRequest({ ...requestInfo });

      const postedRequest = await dbOperator.insert(createdRequest, 'requests');

      loggingTags.res = logger.logFormatter([postedRequest]);
      loggingTags.actionParameters = { poolName: httpRequest.body.poolName };

      logger.info(loggingTags, 'POST request to create Request object.');

      return postedRequest;
    } catch (error) {
      const errorInfo = {
        message: error.message,
      };

      logger.error(
        { errorInfo, loggingTags },
        `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}: ${error.message}`,
      );

      throw error;
    }
  };
}

module.exports = { makePostRequest };
