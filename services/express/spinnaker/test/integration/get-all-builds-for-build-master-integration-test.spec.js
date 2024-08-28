const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');

const { makeGetAllBuildsForBuildMaster } = require('../../use-cases/get-all-builds-for-build-master');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const URL = process.env.SPINNAKER_URL;

describe('Integration Test: (Spinnaker service) Get all builds for build master use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getAllBuildsForBuildMaster;
  let buildMaster;
  let jobName;
  before(() => {
    buildMaster = process.env.INTEGRATION_TEST_BUILD_MASTER;
    jobName = process.env.INTEGRATION_TEST_TARGET_JOB;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getAllBuildsForBuildMaster = makeGetAllBuildsForBuildMaster(request, URL, functionalUserIsAvailableOrTesting, logger);
  });
  xit('should have 1 or more builds if the job exists.', async () => {
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
