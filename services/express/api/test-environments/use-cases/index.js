const { compare, validate } = require('compare-versions');

const { makeCreateTestEnvironment } = require('./create-test-environment');
const { makeListTestEnvironmentById } = require('./list-test-environment-by-id');
const { makeUpdateTestEnvironment } = require('./update-test-environment');
const { makeAddTestEnvironmentIdToPool } = require('./add-test-environment-id-to-pool');
const { makeRemoveTestEnvironmentIdFromPool } = require('./remove-test-environment-id-from-pool');
const { makeAddOrRemoveTestEnvironmentFromPool } = require('./determine-pools-to-add-and-remove-test-environments-from');
const { makeSortTestEnvironmentsByVersion } = require('./sort-test-environments-by-version');
const { makeUpdateViewIndices } = require('./update-view-indices-for-delete');
const { makeUpdateEnvironmentsViewIndices } = require('./update-environments-view-indices-for-delete');
const { makeUpdatePoolsViewIndices } = require('./update-pool-view-indices-for-delete');

const { makeTestEnvironment } = require('../entities');

const logger = require('../../../logger/logger');
const { flattenObject } = require('../../../utilities');

const createNewTestEnvironment = makeCreateTestEnvironment(makeTestEnvironment, logger);
const listTestEnvironmentById = makeListTestEnvironmentById();
const updateTestEnvironment = makeUpdateTestEnvironment(logger, flattenObject);
const addTestEnvironmentIdToPool = makeAddTestEnvironmentIdToPool();
const removeTestEnvironmentIdFromPool = makeRemoveTestEnvironmentIdFromPool();
const addOrRemoveTestEnvironmentFromPool = makeAddOrRemoveTestEnvironmentFromPool();
const sortTestEnvironmentsByVersion = makeSortTestEnvironmentsByVersion(compare, validate);
const updateViewIndices = makeUpdateViewIndices();
const updateEnvironmentsViewIndices = makeUpdateEnvironmentsViewIndices(updateViewIndices);
const updatePoolViewIndices = makeUpdatePoolsViewIndices(updateViewIndices);

const testEnvironmentService = Object.freeze({
  createNewTestEnvironment,
  listTestEnvironmentById,
  updateTestEnvironment,
  addTestEnvironmentIdToPool,
  removeTestEnvironmentIdFromPool,
  addOrRemoveTestEnvironmentFromPool,
  sortTestEnvironmentsByVersion,
  updateViewIndices,
  updateEnvironmentsViewIndices,
  updatePoolViewIndices,
});

module.exports = {
  testEnvironmentService,
  createNewTestEnvironment,
  listTestEnvironmentById,
  updateTestEnvironment,
  addTestEnvironmentIdToPool,
  removeTestEnvironmentIdFromPool,
  addOrRemoveTestEnvironmentFromPool,
  sortTestEnvironmentsByVersion,
  updateViewIndices,
  updateEnvironmentsViewIndices,
  updatePoolViewIndices,
};
