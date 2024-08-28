const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');

const { makeTriggerPipelineExecution } = require('../../use-cases/trigger-pipeline-execution');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const URL = process.env.SPINNAKER_URL;

describe('Integration Test: (Spinnaker service) Trigger a pipeline execution use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let triggerPipelineExecution;
  let applicationName;
  let pipelineNameOrId;
  let payload;
  let tbUser;
  let tbPassword;
  before(() => {
    applicationName = process.env.INTEGRATION_TEST_TARGET_SPINNAKER_APPLICATION;
    pipelineNameOrId = process.env.INTEGRATION_TEST_PIPELINE_NAME;
    tbUser = process.env.TB_FUNCTIONAL_USER;
    tbPassword = process.env.TB_FUNCTIONAL_USER_PASSWORD;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    triggerPipelineExecution = makeTriggerPipelineExecution(request, URL, functionalUserIsAvailableOrTesting, logger);
    payload = {
      parameters: {
        stack: 'DEV',
        hello: 'WORLD',
        RPT: 'ThunderBee',
      },
    };
  });
  afterEach(() => {
    process.env.TB_FUNCTIONAL_USER = tbUser;
    process.env.TB_FUNCTIONAL_USER_PASSWORD = tbPassword;
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
  it('should throw an error if application does not exist and user is not available or incorrect.', async () => {
    process.env.TB_FUNCTIONAL_USER = 'FAKE_USER';
    process.env.TB_FUNCTIONAL_USER_PASSWORD = 'FAKE_PASSWORD';
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
    await expect(triggerPipelineExecution(applicationName, pipelineNameOrId, payload = {}))
      .resolves
      .toBeTruthy();
  });
});
