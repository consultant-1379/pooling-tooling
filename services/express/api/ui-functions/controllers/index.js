const { makePatchTestEnvironmentFromQuarantinedToReserved } = require('./patch-test-environment-from-quarantined-to-reserved');
const { makePatchTestEnvironmentFromQuarantinedToAvailable } = require('./patch-test-environment-from-quarantined-to-available');
const { makePatchTestEnvironmentFromReservedToQuarantined } = require('./patch-test-environment-from-reserved-to-quarantined');
const { makePatchTestEnvironmentFromReservedToAvailable } = require('./patch-test-environment-from-reserved-to-available');
const { makePatchTestEnvironmentFromStandbyToQuarantine } = require('./patch-test-environment-from-standby-to-quarantine');
const { makePatchTestEnvironmentFromStandbyToReserved } = require('./patch-test-environment-from-standby-to-reserved');
const { makePatchTestEnvironmentFromStandbyToRefreshing } = require('./patch-test-environment-from-standby-to-refreshing');
const { makePatchTestEnvironmentFromStandbyToAvailable } = require('./patch-test-environment-from-standby-to-available');
const { makePatchTestEnvironmentFromAvailableToReserved } = require('./patch-test-environment-from-available-to-reserved');
const { dbOperator } = require('../../../data-access');
const httpServer = require('../../../server');
const logger = require('../../../logger/logger');

const { testEnvironmentService } = require('../../test-environments/use-cases');
const { requestService } = require('../../requests/use-cases');

const {
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
} = require('../use-cases');

const patchTestEnvironmentFromQuarantinedToReserved = makePatchTestEnvironmentFromQuarantinedToReserved(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromQuarantinedToAvailable = makePatchTestEnvironmentFromQuarantinedToAvailable(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromReservedToQuarantined = makePatchTestEnvironmentFromReservedToQuarantined(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromReservedToAvailable = makePatchTestEnvironmentFromReservedToAvailable(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromStandbyToQuarantine = makePatchTestEnvironmentFromStandbyToQuarantine(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromStandbyToReserved = makePatchTestEnvironmentFromStandbyToReserved(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromStandbyToRefreshing = makePatchTestEnvironmentFromStandbyToRefreshing(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromStandbyToAvailable = makePatchTestEnvironmentFromStandbyToAvailable(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const patchTestEnvironmentFromAvailableToReserved = makePatchTestEnvironmentFromAvailableToReserved(
  dbOperator,
  testEnvironmentService,
  requestService,
  checkHttpRequestIsValidForUiFunctions,
  checkRequestIdExists,
  httpServer,
  logger,
);

const uiFunctionsController = Object.freeze({
  patchTestEnvironmentFromQuarantinedToReserved,
  patchTestEnvironmentFromQuarantinedToAvailable,
  patchTestEnvironmentFromReservedToQuarantined,
  patchTestEnvironmentFromReservedToAvailable,
  patchTestEnvironmentFromStandbyToQuarantine,
  patchTestEnvironmentFromStandbyToReserved,
  patchTestEnvironmentFromStandbyToRefreshing,
  patchTestEnvironmentFromStandbyToAvailable,
  patchTestEnvironmentFromAvailableToReserved,
});

module.exports = {
  uiFunctionsController,
  patchTestEnvironmentFromQuarantinedToReserved,
  patchTestEnvironmentFromQuarantinedToAvailable,
  patchTestEnvironmentFromReservedToQuarantined,
  patchTestEnvironmentFromReservedToAvailable,
  patchTestEnvironmentFromStandbyToQuarantine,
  patchTestEnvironmentFromStandbyToReserved,
  patchTestEnvironmentFromStandbyToRefreshing,
  patchTestEnvironmentFromStandbyToAvailable,
  patchTestEnvironmentFromAvailableToReserved,
};
