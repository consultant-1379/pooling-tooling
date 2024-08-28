const nodeCron = require('node-cron');
const z = require('zod');

const { buildMakeSchedule } = require('./schedule');
const { buildScheduleSchemas } = require('./schedule-schemas');

const { Id } = require('../../../Id');
const { paramsWithId, cronSchema } = require('../../../interfaces');

const makeSchedule = buildMakeSchedule(Id, nodeCron);
const { patchableScheduleSchema } = buildScheduleSchemas(
  z,
  paramsWithId,
  cronSchema,
);

module.exports = { makeSchedule, patchableScheduleSchema };
