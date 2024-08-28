require('../../../config/config');
const nock = require('nock');
const expect = require('expect');
const request = require('superagent');

const URL = process.env.SPINNAKER_URL;

const { makeTriggerPipelineExecution } = require('../../use-cases/trigger-pipeline-execution');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const MOCK_DATA = {
  ref: '/pipelines/0123ABC456DEF789',
};

describe('Unit Test: (Spinnaker service) Trigger a pipline execution use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let triggerPipelineExecution;
  let applicationName;
  let pipelineNameOrId;
  let payload;
  afterEach(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    triggerPipelineExecution = makeTriggerPipelineExecution(request, URL, functionalUserIsAvailableOrTesting,
      { info: () => 'Test log', error: () => 'Test error log' });
    applicationName = 'fake_application';
    pipelineNameOrId = 'fake_pipeline_name';
    payload = {};
    nock(URL)
      .post(`/pipelines/${applicationName}/${pipelineNameOrId}`)
      .reply(200, MOCK_DATA);
  });
  it('should receive the pipeline ref ID of the execution.', async () => {
    const result = await triggerPipelineExecution(applicationName, pipelineNameOrId, payload);
    expect(result.ref).toBeTruthy();
  });
  it('should throw an error if application does not exist.', async () => {
    await expect(triggerPipelineExecution('NOT_AN_ACTUAL_APPLICATION', pipelineNameOrId, payload))
      .rejects
      .toEqual(new Error(`Unable to trigger the pipeline execution for ${pipelineNameOrId}.`));
  });
  it('should throw an error if pipeline does not exist.', async () => {
    await expect(triggerPipelineExecution(applicationName, 'NOT_AN_ACTUAL_PIPELINE', payload))
      .rejects
      .toEqual(new Error('Unable to trigger the pipeline execution for NOT_AN_ACTUAL_PIPELINE.'));
  });
  it('should not throw an error if both application and pipeline exist.', async () => {
    await expect(triggerPipelineExecution(applicationName, pipelineNameOrId, payload))
      .resolves
      .toBeTruthy();
  });
});
