require('../../../config/config');
const nock = require('nock');
const expect = require('expect');
const request = require('superagent');

const URL = process.env.SPINNAKER_URL;

const { makeGetPipelineConfiguration } = require('../../use-cases/get-pipeline-configuration');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const MOCK_DATA = {
  keepWaitingPipelines: false,
  limitConcurrent: true,
  application: 'fake_application',
  parameterConfig: [],
  spelEvaluator: 'v4',
  lastModifiedBy: 'FAKE_USER',
  name: 'fake_pipeline_name',
  stages: [
    {
      continuePipeline: false,
      failPipeline: true,
      job: 'fake_job',
      master: 'fake_master',
      name: 'MOCK DATA',
      parameters: {},
      refId: '1',
      requisiteStageRefIds: [],
      type: 'jenkins',
    },
  ],
  index: 27,
  id: '0123456789',
  triggers: [
    {
      enabled: true,
      payloadConstraints: {
        foo: 'bar',
      },
      source: 'Demo',
      type: 'webhook',
    },
  ],
  updateTs: '1619636002045',
};

describe('Unit Test: (Spinnaker service) Retrieve pipeline configuration use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getPipelineConfiguration;
  let applicationName;
  let pipelineName;
  afterEach(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getPipelineConfiguration = makeGetPipelineConfiguration(request, URL, functionalUserIsAvailableOrTesting,
      { info: () => 'Test log', error: () => 'Test error log' });
    applicationName = 'fake_application';
    pipelineName = 'fake_pipeline_name';
    nock(URL)
      .get(`/applications/${applicationName}/pipelineConfigs/${pipelineName}`)
      .reply(200, MOCK_DATA);
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
