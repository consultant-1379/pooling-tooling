const express = require('express');

const {
  patchTestEnvironmentFromReservedToQuarantined,
  patchTestEnvironmentFromReservedToAvailable,
  patchTestEnvironmentFromStandbyToAvailable,
  patchRequestFromQueuedToAborted,
} = require('../controllers');

const {
  makePatchExpressCallback,
} = require('../../../express-callback');

const router = express.Router();

router.patch('/test-environment-from-reserved-to-quarantined/:name', makePatchExpressCallback(patchTestEnvironmentFromReservedToQuarantined));
router.patch('/test-environment-from-reserved-to-available/:name', makePatchExpressCallback(patchTestEnvironmentFromReservedToAvailable));
router.patch('/test-environment-from-standby-to-available/:name', makePatchExpressCallback(patchTestEnvironmentFromStandbyToAvailable));
router.patch('/request-from-queued-to-aborted/:id', makePatchExpressCallback(patchRequestFromQueuedToAborted));

module.exports = router;
