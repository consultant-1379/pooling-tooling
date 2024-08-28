const { makeCheckHttpRequestIsValidForUiFunctions } = require('./check-http-request-is-valid-for-ui-functions');
const { makeCheckRequestIdExists } = require('./check-request-id-exists');

const logger = require('../../../logger/logger');

const checkHttpRequestIsValidForUiFunctions = makeCheckHttpRequestIsValidForUiFunctions(logger);
const checkRequestIdExists = makeCheckRequestIdExists();

const uiFunctionsService = Object.freeze({
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
});

module.exports = {
  uiFunctionsService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
};
