const express = require('express');
const { validateRequest } = require('../../../middlewares');

const {
  postRequest,
  getRequests,
  getRequest,
  patchRequest,
  deleteRequest,
} = require('../controllers');
const { patchableRequestSchema } = require('../entities');

const {
  makeGetExpressCallback,
  makePatchExpressCallback,
  makePostExpressCallback,
  makeDeleteExpressCallback,
} = require('../../../express-callback');

const router = express.Router();

router.post('/', validateRequest({ body: patchableRequestSchema }), makePostExpressCallback(postRequest));
router.get('/', makeGetExpressCallback(getRequests));
router.get('/:id', validateRequest({ params: patchableRequestSchema.id }), makeGetExpressCallback(getRequest));
router.patch('/:id', validateRequest({ params: patchableRequestSchema.id, body: patchableRequestSchema }), makePatchExpressCallback(patchRequest, patchableRequestSchema));
router.delete('/:id', validateRequest({ params: patchableRequestSchema.id }), makeDeleteExpressCallback(deleteRequest));

module.exports = router;
