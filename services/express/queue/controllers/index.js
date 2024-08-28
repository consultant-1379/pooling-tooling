const { timeoutQueuedRequest, cancelRequest, reserveRequest } = require('../use-cases');
const { makeTimeoutRequests } = require('./timeout-requests');
const { makeResolveRequests } = require('./resolve-requests');
const { dbOperator } = require('../../data-access');
const logger = require('../../logger/logger');
const { checkIsExecutionCanceled } = require('../../spinnaker/use-cases');

const queuedSearchQuery = { status: 'Queued' };

const timeoutRequests = makeTimeoutRequests(dbOperator, timeoutQueuedRequest, logger, queuedSearchQuery);
const resolveRequests = makeResolveRequests(
  logger,
  dbOperator,
  queuedSearchQuery,
  checkIsExecutionCanceled,
  cancelRequest,
  reserveRequest,
);

const queueController = Object.freeze({
  timeoutRequests,
  resolveRequests,
});

module.exports = {
  queueController,
  timeoutRequests,
  resolveRequests,
};
