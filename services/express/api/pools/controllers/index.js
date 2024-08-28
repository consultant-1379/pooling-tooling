const { makePostPool } = require('./post-pool');
const { makeGetPoolById } = require('./get-pool-by-id');
const { makeGetPools } = require('./get-pools');
const { makePatchPool } = require('./patch-pool');
const { makeDeletePool } = require('./delete-pool');
const { makeGetPoolByName } = require('./get-pool-by-name');
const { makeReserveFreshestAvailableTestEnvironmentInPool } = require('./reserve-freshest-available-test-environment-in-pool');

const { patchTestEnvironment } = require('../../test-environments/controllers');
const { getFreshestTestEnvironment } = require('../../test-environments/controllers');

const { dbOperator } = require('../../../data-access');
const httpServer = require('../../../server');
const logger = require('../../../logger/logger');

const {
  createNewPool,
  updatePool,
  createQueryToSearchAvailableTestEnvironments,
  ensureNoTestEnvironmentsAttachedToPool,
} = require('../use-cases');

const postPool = makePostPool(createNewPool, dbOperator, httpServer, logger);
const getPoolById = makeGetPoolById(dbOperator, logger);
const getPools = makeGetPools(dbOperator, logger);
const patchPool = makePatchPool(updatePool, dbOperator, httpServer, logger);
const deletePool = makeDeletePool(ensureNoTestEnvironmentsAttachedToPool, dbOperator, httpServer, logger);
const getPoolByName = makeGetPoolByName(dbOperator, logger);
const reserveFreshestAvailableTestEnvironmentInPool = makeReserveFreshestAvailableTestEnvironmentInPool(
  dbOperator, createQueryToSearchAvailableTestEnvironments, getFreshestTestEnvironment, patchTestEnvironment, logger,
);

const poolController = Object.freeze({
  postPool,
  getPoolById,
  getPools,
  patchPool,
  deletePool,
  getPoolByName,
  reserveFreshestAvailableTestEnvironmentInPool,
});

module.exports = {
  poolController,
  postPool,
  getPoolById,
  getPools,
  patchPool,
  deletePool,
  getPoolByName,
  reserveFreshestAvailableTestEnvironmentInPool,
};
