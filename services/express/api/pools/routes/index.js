const express = require('express');

const { validateRequest } = require('../../../middlewares');

const {
  postPool,
  getPools,
  getPoolById,
  patchPool,
  deletePool,
  getPoolByName,
} = require('../controllers');
const { patchablePoolSchema } = require('../entities');

const {
  makeGetExpressCallback,
  makePatchExpressCallback,
  makePostExpressCallback,
  makeDeleteExpressCallback,
} = require('../../../express-callback');

const router = express.Router();

router.post('/', validateRequest({ body: patchablePoolSchema }), makePostExpressCallback(postPool));
router.get('/', makeGetExpressCallback(getPools));
router.get('/:id', validateRequest({ params: patchablePoolSchema.id }), makeGetExpressCallback(getPoolById));
router.patch('/:id', validateRequest({ params: patchablePoolSchema.id, body: patchablePoolSchema }), makePatchExpressCallback(patchPool, patchablePoolSchema));
router.delete('/:id', validateRequest({ params: patchablePoolSchema.id }), makeDeleteExpressCallback(deletePool));
router.get('/name/:name', validateRequest({ params: patchablePoolSchema.poolName }), makeGetExpressCallback(getPoolByName));

module.exports = router;
