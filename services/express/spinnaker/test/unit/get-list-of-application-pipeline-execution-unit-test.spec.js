require('../../../config/config');
const nock = require('nock');
const expect = require('expect');
const request = require('superagent');

const URL = process.env.SPINNAKER_URL;

const { makeGetListOfApplicationPipelineExecutions } = require('../../use-cases/get-list-of-application-pipeline-execution');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const MOCK_DATA = [
  {
    type: 'PIPELINE',
    id: '0123456789',
    application: 'fake_application',
    name: 'fake_pipeline_name',
    buildTime: 1619789563419,
    canceled: false,
    limitConcurrent: true,
    keepWaitingPipelines: false,
    stages: [
      {
        id: '0123456789',
        refId: '1',
        type: 'jenkins',
        name: 'MOCK DATA',
        startTime: 1619789563478,
        endTime: 1619789575488,
        status: 'SUCCEEDED',
        context: {
          consecutiveErrors: 0,
          queuedBuild: '12147',
          buildInfo: {
            duration: 82,
            result: 'SUCCESS',
            number: 1000,
            name: 'fake_job',
            fullDisplayName: 'fake_job #1000',
            building: false,
            URL: 'https://URL/jenkins/job/fake_job/1000/',
            timestamp: '1619789569411',
          },
          failPipeline: true,
          job: 'fake_job',
          parameters: {},
          buildNumber: 15,
          continuePipeline: false,
          master: 'fake_master',
        },
        outputs: {
          buildInfo: {
            building: false,
            fullDisplayName: 'fake_job #1000',
            name: 'fake_job',
            number: 1000,
            duration: 82,
            timestamp: '1619789569411',
            result: 'SUCCESS',
            URL: 'https://URL/jenkins/job/fake_job/1000/',
          },
          artifacts: [],
        },
        tasks: [
          {
            id: '1',
            implementingClass:
              'com.netflix.spinnaker.orca.igor.tasks.StartJenkinsJobTask',
            name: 'startJenkinsJob',
            startTime: 1619789563511,
            endTime: 1619789563950,
            status: 'SUCCEEDED',
            stageStart: true,
            stageEnd: false,
            loopStart: false,
            loopEnd: false,
          },
          {
            id: '2',
            implementingClass:
              'com.netflix.spinnaker.orca.igor.tasks.MonitorQueuedJenkinsJobTask',
            name: 'waitForJenkinsJobStart',
            startTime: 1619789563969,
            endTime: 1619789574462,
            status: 'SUCCEEDED',
            stageStart: false,
            stageEnd: false,
            loopStart: false,
            loopEnd: false,
          },
          {
            id: '3',
            implementingClass:
              'com.netflix.spinnaker.orca.igor.tasks.MonitorJenkinsJobTask',
            name: 'monitorJenkinsJob',
            startTime: 1619789574485,
            endTime: 1619789574919,
            status: 'SUCCEEDED',
            stageStart: false,
            stageEnd: false,
            loopStart: false,
            loopEnd: false,
          },
          {
            id: '4',
            implementingClass:
              'com.netflix.spinnaker.orca.igor.tasks.GetBuildPropertiesTask',
            name: 'getBuildProperties',
            startTime: 1619789574929,
            endTime: 1619789574987,
            status: 'SUCCEEDED',
            stageStart: false,
            stageEnd: false,
            loopStart: false,
            loopEnd: false,
          },
          {
            id: '5',
            implementingClass:
              'com.netflix.spinnaker.orca.igor.tasks.GetBuildArtifactsTask',
            name: 'getBuildArtifacts',
            startTime: 1619789575012,
            endTime: 1619789575446,
            status: 'SUCCEEDED',
            stageStart: false,
            stageEnd: true,
            loopStart: false,
            loopEnd: false,
          },
        ],
        requisiteStageRefIds: [],
      },
    ],
    startTime: 1619789563461,
    endTime: 1619789575524,
    status: 'SUCCEEDED',
    authentication: {
      user: 'FAKE_USER',
      allowedAccounts: ['none'],
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

describe('Unit Test: (Spinnaker service) Get list of Spinnaker application pipeline execution use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getListOfApplicationPipelineExecutions;
  let applicationName;
  let limit;
  afterEach(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getListOfApplicationPipelineExecutions = makeGetListOfApplicationPipelineExecutions(request, URL, functionalUserIsAvailableOrTesting,
      { info: () => 'Test log', error: () => 'Test error log' });
    applicationName = 'fake_application';
    limit = 10;
  });
  it('should get the name for the Spinnaker application.', async () => {
    nock(URL)
      .get(`/applications/${applicationName}/pipelines?limit=${limit}`)
      .reply(200, MOCK_DATA);
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(result.application).toBe(applicationName);
  });
  it('should fail because the job application does not exist.', async () => {
    applicationName = 'fake_application_not_present';
    nock(URL)
      .get(`/applications/${applicationName}/pipelines?limit=${limit}`)
      .reply(200, MOCK_DATA);
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(result.application).toEqual(expect.not.stringMatching(applicationName));
  });
  it('should have at least one stage in the pipeline.', async () => {
    nock(URL)
      .get(`/applications/${applicationName}/pipelines?limit=${limit}`)
      .reply(200, MOCK_DATA);
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(result.stages.length).toBeGreaterThanOrEqual(1);
  });
  it('should have valid status.', async () => {
    nock(URL)
      .get(`/applications/${applicationName}/pipelines?limit=${limit}`)
      .reply(200, MOCK_DATA);
    const expectedStatus = ['NOT_STARTED', 'RUNNING', 'PAUSED', 'SUSPENDED', 'SUCCEEDED', 'FAILED_CONTINUE', 'TERMINAL', 'CANCELED', 'REDIRECT', 'STOPPED', 'SKIPPED', 'BUFFERED'];
    const [result] = await getListOfApplicationPipelineExecutions(applicationName, limit);
    expect(expectedStatus).toEqual(expect.arrayContaining([result.status]));
  });
  it('should not throw an error if the application name exist.', async () => {
    nock(URL)
      .get(`/applications/${applicationName}/pipelines?limit=${limit}`)
      .reply(200, MOCK_DATA);
    await expect(getListOfApplicationPipelineExecutions(applicationName, limit))
      .resolves
      .toBeTruthy();
  });
});
