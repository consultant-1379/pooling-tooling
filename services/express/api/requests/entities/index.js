const z = require('zod');

const { buildMakeRequest } = require('./request');
const { buildRequestSchemas } = require('./request-schemas');

const { Id } = require('../../../Id');
const { paramsWithId } = require('../../../interfaces');

const makeRequest = buildMakeRequest(Id);

const { patchableRequestSchema } = buildRequestSchemas(
  z,
  paramsWithId,
);

module.exports = { makeRequest, patchableRequestSchema };
