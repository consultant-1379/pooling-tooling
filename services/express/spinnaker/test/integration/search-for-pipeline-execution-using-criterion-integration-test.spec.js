const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');

const { makeSearchForPipelineExecutionUsingCriteria } = require('../../use-cases/search-for-pipeline-execution-using-criteria');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

const URL = process.env.SPINNAKER_URL;

describe('Integration Test: (Spinnaker service) Search for pipeline execution using criterion use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let searchForPipelineExecutionUsingCriteria;
  let applicationName;
  let emptyApplicationName;
  let pipelineName;
  let pipelineStatus;
  before(() => {
    applicationName = process.env.INTEGRATION_TEST_TARGET_SPINNAKER_APPLICATION;
    emptyApplicationName = process.env.INTEGRATION_TEST_TARGET_EMPTY_SPINNAKER_APPLICATION;
    pipelineName = process.env.INTEGRATION_TEST_PIPELINE_NAME;
    pipelineStatus = 'SUCCEEDED';
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    searchForPipelineExecutionUsingCriteria = makeSearchForPipelineExecutionUsingCriteria(request, URL, functionalUserIsAvailableOrTesting, logger);
  });
  it('should get the name for the Spinnaker application.', async () => {
    const [result] = await searchForPipelineExecutionUsingCriteria(applicationName, pipelineName, pipelineStatus);
    expect(result.application).toBe(applicationName);
  });
  it('should get the pipeline name in the Spinnaker application.', async () => {
    const [result] = await searchForPipelineExecutionUsingCriteria(applicationName, pipelineName, pipelineStatus);
    expect(result.name).toBe(pipelineName);
  });
  it('should get the pipeline status.', async () => {
    const [result] = await searchForPipelineExecutionUsingCriteria(applicationName, pipelineName, pipelineStatus);
    expect(result.status).toBe(pipelineStatus);
  });
  it('should not throw an error if application, pipeline and pipeline status exist.', async () => {
    await expect(searchForPipelineExecutionUsingCriteria(applicationName, pipelineName, pipelineStatus))
      .resolves
      .toBeTruthy();
  });
  it('should throw an error if pipeline status is incorrect.', async () => {
    await expect(searchForPipelineExecutionUsingCriteria(applicationName, pipelineName, 'NOT_AN_ACTUAL_PIPELINE_STATUS'))
      .rejects
      .toEqual(new NotFoundError('Unable to find the pipeline execution using provided criteria.'));
  });
  it('should return an empty array if the pipeline does not exist.', async () => {
    const result = await searchForPipelineExecutionUsingCriteria('NOT_AN_ACTUAL_APPLICATION', pipelineName, pipelineStatus);
    expect(result.length).toEqual(0);
  });
  it('should return an empty array if the pipeline does not exist.', async () => {
    const result = await searchForPipelineExecutionUsingCriteria(applicationName, 'NOT_AN_ACTUAL_PIPELINE', pipelineStatus);
    expect(result.length).toEqual(0);
  });
  it('should return an empty array if a new application and a new pipeline exist.', async () => {
    const result = await searchForPipelineExecutionUsingCriteria(emptyApplicationName, pipelineName, pipelineStatus);
    expect(result.length).toEqual(0);
  });
});
