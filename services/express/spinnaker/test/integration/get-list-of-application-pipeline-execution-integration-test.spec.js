const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');

const { makeGetListOfApplicationPipelineExecutions } = require('../../use-cases/get-list-of-application-pipeline-execution');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const URL = process.env.SPINNAKER_URL;

describe('Integration Test: (Spinnaker service) Get list of Spinnaker application pipeline execution use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getListOfApplicationPipelineExecutions;
  let applicationName;
  let emptyApplicationName;
  let limit;
  before(() => {
    applicationName = process.env.INTEGRATION_TEST_TARGET_SPINNAKER_APPLICATION;
    emptyApplicationName = process.env.INTEGRATION_TEST_TARGET_EMPTY_SPINNAKER_APPLICATION;
    limit = 10;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getListOfApplicationPipelineExecutions = makeGetListOfApplicationPipelineExecutions(request, URL, functionalUserIsAvailableOrTesting, logger);
  });
  it('should get the name for the Spinnaker application.', async () => {
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(result.application).toBe(applicationName);
  });
  it('should assert that pipeline name is not null.', async () => {
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(result.name).not.toBeNull();
  });
  xit('should have at least one stage in the pipeline.', async () => {
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(result.stages.length).toBeGreaterThanOrEqual(1);
  });
  it('should have valid status.', async () => {
    const expectedStatus = ['NOT_STARTED', 'RUNNING', 'PAUSED', 'SUSPENDED', 'SUCCEEDED',
      'FAILED_CONTINUE', 'TERMINAL', 'CANCELED', 'REDIRECT', 'STOPPED', 'SKIPPED', 'BUFFERED'];
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(expectedStatus).toEqual(expect.arrayContaining([result.status]));
  });
  it('should not throw an error if the application name exist.', async () => {
    await expect(getListOfApplicationPipelineExecutions(applicationName, limit))
      .resolves
      .toBeTruthy();
  });
  it('should return an empty array if a new application exist.', async () => {
    const result = await getListOfApplicationPipelineExecutions(emptyApplicationName, limit);
    expect(result.length).toEqual(0);
  });
  it('should return an empty array if the application does not exist.', async () => {
    const result = await getListOfApplicationPipelineExecutions('NOT_AN_ACTUAL_APPLICATION', limit);
    expect(result.length).toEqual(0);
  });
});
