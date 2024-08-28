const { makePostRequest } = require('./post-request');
const { makeGetRequest } = require('./get-request');
const { makeGetRequests } = require('./get-requests');
const { makePatchRequest } = require('./patch-request');
const { makeDeleteRequest } = require('./remove-request');

const {
  createNewRequest,
  updateRequest,
} = require('../use-cases');

const { dbOperator } = require('../../../data-access');
const logger = require('../../../logger/logger');

const postRequest = makePostRequest(createNewRequest, dbOperator, logger);
const getRequest = makeGetRequest(dbOperator, logger);
const getRequests = makeGetRequests(dbOperator, logger);
const patchRequest = makePatchRequest(updateRequest, dbOperator, logger);
const deleteRequest = makeDeleteRequest(dbOperator, logger);

const requestController = Object.freeze({
  postRequest,
  getRequest,
  getRequests,
  patchRequest,
  deleteRequest,
});

module.exports = {
  requestController,
  postRequest,
  getRequest,
  getRequests,
  patchRequest,
  deleteRequest,
};
