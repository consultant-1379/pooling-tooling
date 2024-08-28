const express = require('express');

const {
  patchTestEnvironmentFromQuarantinedToReserved,
  patchTestEnvironmentFromQuarantinedToAvailable,
  patchTestEnvironmentFromReservedToQuarantined,
  patchTestEnvironmentFromReservedToAvailable,
  patchTestEnvironmentFromStandbyToQuarantine,
  patchTestEnvironmentFromStandbyToReserved,
  patchTestEnvironmentFromStandbyToRefreshing,
  patchTestEnvironmentFromStandbyToAvailable,
  patchTestEnvironmentFromAvailableToReserved,
} = require('../controllers');
const { makePatchExpressCallback } = require('../../../express-callback');

const router = express.Router();

router.patch('/test-environment-from-quarantined-to-reserved/:id', makePatchExpressCallback(patchTestEnvironmentFromQuarantinedToReserved));
router.patch('/test-environment-from-quarantined-to-available/:id', makePatchExpressCallback(patchTestEnvironmentFromQuarantinedToAvailable));
router.patch('/test-environment-from-reserved-to-quarantined/:id', makePatchExpressCallback(patchTestEnvironmentFromReservedToQuarantined));
router.patch('/test-environment-from-reserved-to-available/:id', makePatchExpressCallback(patchTestEnvironmentFromReservedToAvailable));
router.patch('/test-environment-from-standby-to-quarantine/:id', makePatchExpressCallback(patchTestEnvironmentFromStandbyToQuarantine));
router.patch('/test-environment-from-standby-to-reserved/:id', makePatchExpressCallback(patchTestEnvironmentFromStandbyToReserved));
router.patch('/test-environment-from-standby-to-refreshing/:id', makePatchExpressCallback(patchTestEnvironmentFromStandbyToRefreshing));
router.patch('/test-environment-from-standby-to-available/:id', makePatchExpressCallback(patchTestEnvironmentFromStandbyToAvailable));
router.patch('/test-environment-from-available-to-reserved/:id', makePatchExpressCallback(patchTestEnvironmentFromAvailableToReserved));

module.exports = router;
