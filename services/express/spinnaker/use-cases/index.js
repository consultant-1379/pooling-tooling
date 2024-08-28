require('../../config/config');
const request = require('superagent');
const logger = require('../../logger/logger');

const url = process.env.SPINNAKER_URL;

const { makeFunctionalUserIsAvailableOrTesting } = require('./check-is-functional-user-available-or-testing');
const { makeGetListOfApplicationPipelineExecutions } = require('./get-list-of-application-pipeline-execution');
const { makeGetPipelineConfiguration } = require('./get-pipeline-configuration');
const { makeGetSingleBuildForBuildMaster } = require('./get-single-build-for-build-master');
const { makeGetAllBuildsForBuildMaster } = require('./get-all-builds-for-build-master');
const { makeSearchForPipelineExecutionUsingCriteria } = require('./search-for-pipeline-execution-using-criteria');
const { makeTriggerPipelineExecution } = require('./trigger-pipeline-execution');
const { makeCheckIsExecutionCanceled } = require('./check-is-execution-canceled');

const functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
const getListOfApplicationPipelineExecutions = makeGetListOfApplicationPipelineExecutions(request, url, functionalUserIsAvailableOrTesting, logger);
const getPipelineConfiguration = makeGetPipelineConfiguration(request, url, functionalUserIsAvailableOrTesting, logger);
const getSingleBuildForBuildMaster = makeGetSingleBuildForBuildMaster(request, url, functionalUserIsAvailableOrTesting, logger);
const getAllBuildsForBuildMaster = makeGetAllBuildsForBuildMaster(request, url, functionalUserIsAvailableOrTesting, logger);
const searchForPipelineExecutionUsingCriteria = makeSearchForPipelineExecutionUsingCriteria(request, url, functionalUserIsAvailableOrTesting, logger);
const triggerPipelineExecution = makeTriggerPipelineExecution(request, url, functionalUserIsAvailableOrTesting, logger);
const checkIsExecutionCanceled = makeCheckIsExecutionCanceled(request, url, logger);

const useSpinnakerApiService = Object.freeze({
  getListOfApplicationPipelineExecutions,
  getPipelineConfiguration,
  getSingleBuildForBuildMaster,
  getAllBuildsForBuildMaster,
  searchForPipelineExecutionUsingCriteria,
  triggerPipelineExecution,
  checkIsExecutionCanceled,
});

module.exports = {
  useSpinnakerApiService,
  getListOfApplicationPipelineExecutions,
  getPipelineConfiguration,
  getSingleBuildForBuildMaster,
  getAllBuildsForBuildMaster,
  searchForPipelineExecutionUsingCriteria,
  triggerPipelineExecution,
  checkIsExecutionCanceled,
  makeGetListOfApplicationPipelineExecutions,
  makeGetPipelineConfiguration,
  makeGetSingleBuildForBuildMaster,
  makeGetAllBuildsForBuildMaster,
  makeSearchForPipelineExecutionUsingCriteria,
  makeTriggerPipelineExecution,
  makeCheckIsExecutionCanceled,
};
