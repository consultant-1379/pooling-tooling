const { makeTimeoutQueuedRequest } = require('./timeout-queued-requests');
const { makeCancelRequest } = require('./cancel-request');
const { makeReserveRequest } = require('./reserve-request');
const { updateRequest } = require('../../api/requests/use-cases');
const logger = require('../../logger/logger');
const { dbOperator } = require('../../data-access');
const { reserveFreshestAvailableTestEnvironmentInPool } = require('../../api/pools/controllers');

const timeoutQueuedRequest = makeTimeoutQueuedRequest(updateRequest);

const cancelRequest = makeCancelRequest(logger, dbOperator, updateRequest);

const reserveRequest = makeReserveRequest(
  logger,
  dbOperator,
  reserveFreshestAvailableTestEnvironmentInPool,
  updateRequest,
);

const queueService = Object.freeze({
  timeoutQueuedRequest,
  cancelRequest,
  reserveRequest,
});

module.exports = {
  queueService,
  timeoutQueuedRequest,
  cancelRequest,
  reserveRequest,
};
