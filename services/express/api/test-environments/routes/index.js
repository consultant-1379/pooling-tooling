const express = require('express');
const { validateRequest } = require('../../../middlewares');

const {
  deleteTestEnvironment,
  getTestEnvironment,
  getTestEnvironments,
  getTestEnvironmentsSorted,
  getTestEnvironmentByName,
  patchTestEnvironment,
  postTestEnvironment,
  getTestEnvironmentsByPool,
  getTestEnvironmentsByPoolSorted,
  getTestEnvironmentsByStatus,
  getFreshestTestEnvironment,
} = require('../controllers');
const { patchableTestEnvironmentSchema } = require('../entities');

const {
  makeGetExpressCallback,
  makePatchExpressCallback,
  makePostExpressCallback,
  makeDeleteExpressCallback,
} = require('../../../express-callback');

const router = express.Router();

router.delete('/:id', validateRequest({ params: patchableTestEnvironmentSchema.id }), makeDeleteExpressCallback(deleteTestEnvironment));
router.get('/', makeGetExpressCallback(getTestEnvironments));
router.get('/sorted', makeGetExpressCallback(getTestEnvironmentsSorted));
router.get('/:id', validateRequest({ params: patchableTestEnvironmentSchema.id }), makeGetExpressCallback(getTestEnvironment));
router.get('/name/:name', validateRequest({ params: patchableTestEnvironmentSchema.name }), makeGetExpressCallback(getTestEnvironmentByName));
router.patch('/:id', validateRequest({ params: patchableTestEnvironmentSchema.id, body: patchableTestEnvironmentSchema }), makePatchExpressCallback(patchTestEnvironment, patchableTestEnvironmentSchema));
router.post('/', validateRequest({ body: patchableTestEnvironmentSchema }), makePostExpressCallback(postTestEnvironment));
router.get('/pools/:pool', validateRequest({ params: patchableTestEnvironmentSchema.name }), makeGetExpressCallback(getTestEnvironmentsByPool));
router.get('/pools/:pool/sorted', validateRequest({ params: patchableTestEnvironmentSchema.name }), makeGetExpressCallback(getTestEnvironmentsByPoolSorted));
router.get('/status/:status', validateRequest({ params: patchableTestEnvironmentSchema.status }), makeGetExpressCallback(getTestEnvironmentsByStatus));
router.get('/get-freshest-test-environment/:ids', validateRequest({ params: patchableTestEnvironmentSchema.id }), makeGetExpressCallback(getFreshestTestEnvironment));

module.exports = router;
