const { makeCreateRequest } = require('./create-request');
const { makeUpdateRequest } = require('./update-request');
const { makeRequest } = require('../entities');

const logger = require('../../../logger/logger');
const { flattenObject } = require('../../../utilities');

const createNewRequest = makeCreateRequest(makeRequest, logger);
const updateRequest = makeUpdateRequest(logger, flattenObject);

const requestService = Object.freeze({
  createNewRequest,
  updateRequest,
});

module.exports = {
  requestService,
  createNewRequest,
  updateRequest,
};
