require('../../../config/config');
const nock = require('nock');
const expect = require('expect');
const request = require('superagent');

const URL = process.env.SPINNAKER_URL;

const { makeGetAllBuildsForBuildMaster } = require('../../use-cases/get-all-builds-for-build-master');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const MOCK_DATA = [
  {
    building: false,
    number: 2,
    result: 'SUCCESS',
    timestamp: '1619792936945',
    duration: 9800,
    URL:
      'https://URL/jenkins/job/fake_jenkins_job_name/2/',
    fullDisplayName: 'fake_jenkins_job_name #2',
  },
  {
    building: false,
    number: 1,
    result: 'SUCCESS',
    timestamp: '1619792821952',
    duration: 1030,
    URL:
      'https://URL/jenkins/job/fake_jenkins_job_name/1/',
    fullDisplayName: 'fake_jenkins_job_name #1',
  },
];

describe('Unit Test: (Spinnaker service) Get all builds for build master use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getAllBuildsForBuildMaster;
  let buildMaster;
  let jobName;
  afterEach(() => {
    nock.cleanAll();
  });
  beforeEach(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getAllBuildsForBuildMaster = makeGetAllBuildsForBuildMaster(request, URL, functionalUserIsAvailableOrTesting,
      { info: () => 'Test log', error: () => 'Test error log' });
    buildMaster = 'fake_master';
    jobName = 'fake_jenkins_job_name';
    nock(URL)
      .get(`/v3/builds/${buildMaster}/builds?job=${jobName}`)
      .reply(200, MOCK_DATA);
  });
  it('should have 1 or more builds if the job exist.', async () => {
    const result = await getAllBuildsForBuildMaster(buildMaster, jobName);
    expect(result.length).toBeGreaterThanOrEqual(1);
  });
  it('should have 7 key value pairs in any build retrieved.', async () => {
    const result = await getAllBuildsForBuildMaster(buildMaster, jobName);
    expect(Object.keys(result[0]).length).toEqual(7);
  });
  it('should throw an error if build master does not exist.', async () => {
    await expect(getAllBuildsForBuildMaster('NOT_AN_ACTUAL_BUILD_MASTER', jobName))
      .rejects
      .toEqual(new Error('Unable to GET all builds for build master.'));
  });
  it('should throw an error if job does not exist.', async () => {
    await expect(getAllBuildsForBuildMaster(buildMaster, 'NOT_AN_ACTUAL_JOB'))
      .rejects
      .toEqual(new Error('Unable to GET all builds for build master.'));
  });
  it('should not throw an error if both build master and job name exist.', async () => {
    await expect(getAllBuildsForBuildMaster(buildMaster, jobName))
      .resolves
      .toBeTruthy();
  });
});
