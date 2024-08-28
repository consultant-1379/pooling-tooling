const z = require('zod');

const { buildMakeTestEnvironment } = require('./test-environment');
const { buildTestEnvironmentSchemas } = require('./test-environment-schemas');
const { makePopulateMissingProperties } = require('./populate-missing-properties');

const { Id } = require('../../../Id');
const { paramsWithId } = require('../../../interfaces');

const makeTestEnvironment = buildMakeTestEnvironment(Id);

const populateMissingProperties = makePopulateMissingProperties();

const { patchableTestEnvironmentSchema } = buildTestEnvironmentSchemas(
  z,
  paramsWithId,
);

module.exports = {
  makeTestEnvironment,
  patchableTestEnvironmentSchema,
  populateMissingProperties,
};
