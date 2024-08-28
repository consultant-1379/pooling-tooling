const express = require('express');
const { validateRequest } = require('../../../middlewares');

const {
  postSchedule,
  getSchedules,
  getScheduleByName,
  patchSchedule,
  deleteSchedule,
} = require('../controllers');
const { patchableScheduleSchema } = require('../entities');

const {
  makePostExpressCallback,
  makeGetExpressCallback,
  makePatchExpressCallback,
  makeDeleteExpressCallback,
} = require('../../../express-callback');

const router = express.Router();

router.post('/', validateRequest({ body: patchableScheduleSchema }), makePostExpressCallback(postSchedule));
router.get('/', makeGetExpressCallback(getSchedules));
router.get('/name/:name', validateRequest({ params: patchableScheduleSchema.scheduleName }), makeGetExpressCallback(getScheduleByName));
router.patch('/:id', validateRequest({ params: patchableScheduleSchema.id, body: patchableScheduleSchema }), makePatchExpressCallback(patchSchedule, patchableScheduleSchema));
router.delete('/:id', validateRequest({ params: patchableScheduleSchema.id }), makeDeleteExpressCallback(deleteSchedule));

module.exports = router;
