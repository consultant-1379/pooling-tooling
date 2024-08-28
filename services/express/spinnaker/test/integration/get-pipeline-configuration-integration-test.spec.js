const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');

const { makeGetPipelineConfiguration } = require('../../use-cases/get-pipeline-configuration');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const URL = process.env.SPINNAKER_URL;

describe('Integration Test: (Spinnaker service) Retrieve pipeline configuration use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getPipelineConfiguration;
  let applicationName;
  let pipelineName;
  before(() => {
    applicationName = process.env.INTEGRATION_TEST_TARGET_SPINNAKER_APPLICATION;
    pipelineName = process.env.INTEGRATION_TEST_PIPELINE_NAME;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getPipelineConfiguration = makeGetPipelineConfiguration(request, URL, functionalUserIsAvailableOrTesting, logger);
  });
  it('should get the name for the Spinnaker application.', async () => {
    const result = await getPipelineConfiguration(applicationName, pipelineName);
    expect(result.application).toBe(applicationName);
  });
  it('should get the pipeline name in the Spinnaker application.', async () => {
    const result = await getPipelineConfiguration(applicationName, pipelineName);
    expect(result.name).toBe(pipelineName);
  });
  it('should have at least one stage in the pipeline.', async () => {
    const result = await getPipelineConfiguration(applicationName, pipelineName);
    expect(result.stages.length).toBeGreaterThanOrEqual(1);
  });
  it('should throw an error if pipeline does not exist.', async () => {
    await expect(getPipelineConfiguration(applicationName, 'NOT_AN_ACTUAL_PIPELINE_NAME'))
      .rejects
      .toEqual(new Error('Unable to GET pipeline configuration.'));
  });
  it('should throw an error if application does not exist.', async () => {
    await expect(getPipelineConfiguration('NOT_AN_ACTUAL_APPLICATION', pipelineName))
      .rejects
      .toEqual(new Error('Unable to GET pipeline configuration.'));
  });
  it('should not throw an error if both pipeline and application exist.', async () => {
    await expect(getPipelineConfiguration(applicationName, pipelineName))
      .resolves
      .toBeTruthy();
  });
});
