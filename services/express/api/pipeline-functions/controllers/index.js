const { makePatchTestEnvironmentFromReservedToQuarantined } = require('./patch-test-environment-from-reserved-to-quarantined');
const { makePatchTestEnvironmentFromReservedToAvailable } = require('./patch-test-environment-from-reserved-to-available');
const { makePatchTestEnvironmentFromStandbyToAvailable } = require('./patch-test-environment-from-standby-to-available');
const { makePatchRequestFromQueuedToAborted } = require('./patch-request-from-queued-to-aborted');

const { dbOperator } = require('../../../data-access');
const httpServer = require('../../../server');
const logger = require('../../../logger/logger');

const { testEnvironmentService } = require('../../test-environments/use-cases');
const { requestService } = require('../../requests/use-cases');

const {
  checkRequestIdExists,
} = require('../use-cases');

const patchTestEnvironmentFromReservedToQuarantined = makePatchTestEnvironmentFromReservedToQuarantined(
  testEnvironmentService,
  dbOperator,
  httpServer,
  logger,
);

const patchTestEnvironmentFromReservedToAvailable = makePatchTestEnvironmentFromReservedToAvailable(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkRequestIdExists,
  httpServer,
  logger,
);
const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
  dbOperator,
  testEnvironmentService,
  logger,
);

const patchRequestFromQueuedToAborted = makePatchRequestFromQueuedToAborted(
  dbOperator,
  requestService,
  logger,
);

const pipelineFunctionsController = Object.freeze({
  patchTestEnvironmentFromReservedToQuarantined,
  patchTestEnvironmentFromReservedToAvailable,
  patchTestEnvironmentFromStandbyToAvailable,
  patchRequestFromQueuedToAborted,
});

module.exports = {
  pipelineFunctionsController,
  patchTestEnvironmentFromReservedToQuarantined,
  patchTestEnvironmentFromReservedToAvailable,
  patchRequestFromQueuedToAborted,
  patchTestEnvironmentFromStandbyToAvailable,
};
