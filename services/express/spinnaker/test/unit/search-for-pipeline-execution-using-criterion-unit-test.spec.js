require('../../../config/config');
const nock = require('nock');
const expect = require('expect');
const request = require('superagent');

const URL = process.env.SPINNAKER_URL;

const { makeSearchForPipelineExecutionUsingCriteria } = require('../../use-cases/search-for-pipeline-execution-using-criteria');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');
const { NotFoundError } = require('../../../interfaces/NotFoundError');

const MOCK_DATA = [
  {
    type: 'PIPELINE',
    id: '0123456789',
    application: 'fake_application',
    name: 'fake_pipeline_name',
    buildTime: 1619792926620,
    canceled: false,
    limitConcurrent: true,
    keepWaitingPipelines: false,
    stages: [
      {
        id: '123456789',
        refId: '1',
        type: 'jenkins',
        name: 'MOCK DATA',
        startTime: 1619792926667,
        endTime: 1619792938326,
        status: 'SUCCEEDED',
        context: {},
        outputs: {},
        tasks: [],
        requisiteStageRefIds: [],
      },
    ],
    startTime: 1619792926660,
    endTime: 1619792938364,
    status: 'SUCCEEDED',
    authentication: {
      user: 'FAKE_USER',
      allowedAccounts: [
        'none',
      ],
    },
    origin: 'api',
    trigger: {
      type: 'manual',
      user: 'FAKE_USER',
      parameters: {},
      artifacts: [],
      notifications: [],
      rebake: false,
      dryRun: false,
      strategy: false,
      resolvedExpectedArtifacts: [],
      expectedArtifacts: [],
    },
    pipelineConfigId: '012-345-678-9',
    notifications: [],
    initialConfig: {},
    systemNotifications: [],
    spelEvaluator: 'v4',
  },
];

describe('Unit Test: (Spinnaker service) Search for pipeline execution using criterion use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let searchForPipelineExecutionUsingCriteria;
  let applicationName;
  let pipelineName;
  let pipelineStatus;
  afterEach(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    searchForPipelineExecutionUsingCriteria = makeSearchForPipelineExecutionUsingCriteria(request, URL, functionalUserIsAvailableOrTesting,
      { info: () => 'Test log', error: () => 'Test error log' });
    applicationName = 'fake_application';
    pipelineName = 'fake_pipeline_name';
    pipelineStatus = 'SUCCEEDED';
    nock(URL)
      .get(`/applications/${applicationName}/executions/search?pipelineName=${pipelineName}&statuses=${pipelineStatus}`)
      .reply(200, MOCK_DATA);
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
});
