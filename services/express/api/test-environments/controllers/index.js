const { makeDeleteTestEnvironment } = require('./remove-test-environment');
const { makeGetTestEnvironment } = require('./get-test-environment');
const { makeGetTestEnvironmentByName } = require('./get-test-environment-by-name');
const { makeGetTestEnvironments } = require('./get-test-environments');
const { makePatchTestEnvironment } = require('./patch-test-environment');
const { makePostTestEnvironment } = require('./post-test-environment');
const { makeGetTestEnvironmentsByPool } = require('./get-test-environments-by-pool');
const { makeGetTestEnvironmentsByStatus } = require('./get-test-environment-by-status');
const { makeGetFreshestTestEnvironment } = require('./get-freshest-test-environment');
const { makeGetTestEnvironmentsSorted } = require('./get-test-environments-sorted');
const { makeGetTestEnvironmentsByPoolSorted } = require('./get-test-environments-by-pool-sorted');
const { makeCreateIndexes } = require('./create-indexes');

const { updatePool } = require('../../pools/use-cases');
const { dbOperator } = require('../../../data-access');

const httpServer = require('../../../server');
const logger = require('../../../logger/logger');

const {
  createNewTestEnvironment,
  listTestEnvironmentById,
  updateTestEnvironment,
  addTestEnvironmentIdToPool,
  removeTestEnvironmentIdFromPool,
  addOrRemoveTestEnvironmentFromPool,
  sortTestEnvironmentsByVersion,
  updatePoolViewIndices,
  updateEnvironmentsViewIndices,
} = require('../use-cases');

makeCreateIndexes(dbOperator, logger)();

const deleteTestEnvironment = makeDeleteTestEnvironment(
  removeTestEnvironmentIdFromPool, updatePoolViewIndices, updateEnvironmentsViewIndices, dbOperator, httpServer, logger,
);
const getTestEnvironment = makeGetTestEnvironment(dbOperator, logger);
const getTestEnvironments = makeGetTestEnvironments(dbOperator, logger);
const getTestEnvironmentByName = makeGetTestEnvironmentByName(dbOperator, logger);
const patchTestEnvironment = makePatchTestEnvironment(
  listTestEnvironmentById,
  updateTestEnvironment,
  addOrRemoveTestEnvironmentFromPool,
  addTestEnvironmentIdToPool,
  removeTestEnvironmentIdFromPool,
  updatePool,
  dbOperator,
  httpServer,
  logger,
);
const postTestEnvironment = makePostTestEnvironment(createNewTestEnvironment, addTestEnvironmentIdToPool, dbOperator, httpServer, logger);
const getTestEnvironmentsByPool = makeGetTestEnvironmentsByPool(dbOperator, logger);
const getTestEnvironmentsByStatus = makeGetTestEnvironmentsByStatus(dbOperator, logger);
const getFreshestTestEnvironment = makeGetFreshestTestEnvironment(dbOperator, sortTestEnvironmentsByVersion, logger);
const getTestEnvironmentsSorted = makeGetTestEnvironmentsSorted(dbOperator, logger);
const getTestEnvironmentsByPoolSorted = makeGetTestEnvironmentsByPoolSorted(dbOperator, logger);

const testEnvironmentController = Object.freeze({
  deleteTestEnvironment,
  getTestEnvironment,
  getTestEnvironments,
  getTestEnvironmentByName,
  patchTestEnvironment,
  postTestEnvironment,
  getTestEnvironmentsByPool,
  getTestEnvironmentsByStatus,
  getFreshestTestEnvironment,
  getTestEnvironmentsSorted,
  getTestEnvironmentsByPoolSorted,
});

module.exports = {
  testEnvironmentController,
  deleteTestEnvironment,
  getTestEnvironment,
  getTestEnvironments,
  getTestEnvironmentByName,
  patchTestEnvironment,
  postTestEnvironment,
  getTestEnvironmentsByPool,
  getTestEnvironmentsByStatus,
  getFreshestTestEnvironment,
  getTestEnvironmentsSorted,
  getTestEnvironmentsByPoolSorted,
};
