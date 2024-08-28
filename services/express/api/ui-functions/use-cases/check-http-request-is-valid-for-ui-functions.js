const { BadRequestError } = require('../../../interfaces/BadRequestError');

function makeCheckHttpRequestIsValidForUiFunctions(logger) {
  return function checkHttpRequestIsValidForUiFunctions(httpRequest) {
    const loggingTags = {
      service: 'UI Functions (use-cases)',
      action: 'checkHttpRequestIsValidForUiFunctions',
      actionParameters: {},
    };
    if (typeof httpRequest.body !== 'object' || httpRequest.body === null || typeof httpRequest.params !== 'object'
      || typeof httpRequest.body.additionalInfo !== 'string'
      || !Object.prototype.hasOwnProperty.call(httpRequest.body, 'additionalInfo')
      || !Object.prototype.hasOwnProperty.call(httpRequest.params, 'id')) {
      const errorInfo = {
        message: 'Invalid http request to update Test Environment and/or Request entity.',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    if (httpRequest.body.additionalInfo === '' || httpRequest.params.id === '') {
      const errorInfo = {
        message: 'Not enough data to update the Test Environment and/or Request entities.',
      };
      logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`);
      throw new BadRequestError(errorInfo.message);
    }

    return httpRequest;
  };
}

module.exports = { makeCheckHttpRequestIsValidForUiFunctions };
