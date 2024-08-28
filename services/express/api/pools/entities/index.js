const z = require('zod');

const { buildMakePool } = require('./pool');
const { buildPoolSchemas } = require('./pool-schemas');

const { Id } = require('../../../Id');
const { paramsWithId } = require('../../../interfaces');

const makePool = buildMakePool(Id);

const { patchablePoolSchema } = buildPoolSchemas(z, paramsWithId);

module.exports = { makePool, patchablePoolSchema };
