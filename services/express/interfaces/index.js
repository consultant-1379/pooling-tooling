const z = require('zod');
const nodeCron = require('node-cron');

const { buildParamsWithId } = require('./id-schema');
const { buildCronSchema } = require('./cron-schema');

const { Id } = require('../Id');

const paramsWithId = buildParamsWithId(z, Id);
const cronSchema = buildCronSchema(z, nodeCron);

module.exports = { paramsWithId, cronSchema };
