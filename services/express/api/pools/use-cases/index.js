const { makeCreatePool } = require('./create-pool');
const { makeUpdatePool } = require('./update-pool');
const { makeCreateQueryToSearchAvailableTestEnvironments } = require('./create-query-to-search-available-test-environments');
const { makeEnsureNoTestEnvironmentsAttachedToPool } = require('./ensure-no-test-environments-attached-to-pool');

const { makePool } = require('../entities');
const logger = require('../../../logger/logger');
const { flattenObject } = require('../../../utilities');

const createNewPool = makeCreatePool(makePool, logger);
const updatePool = makeUpdatePool(logger, flattenObject);
const createQueryToSearchAvailableTestEnvironments = makeCreateQueryToSearchAvailableTestEnvironments(makePool);
const ensureNoTestEnvironmentsAttachedToPool = makeEnsureNoTestEnvironmentsAttachedToPool();

const poolService = Object.freeze({
  createNewPool,
  updatePool,
  createQueryToSearchAvailableTestEnvironments,
  ensureNoTestEnvironmentsAttachedToPool,
});

module.exports = {
  poolService,
  createNewPool,
  updatePool,
  createQueryToSearchAvailableTestEnvironments,
  ensureNoTestEnvironmentsAttachedToPool,
};
