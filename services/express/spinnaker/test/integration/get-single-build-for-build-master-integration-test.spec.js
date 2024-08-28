const expect = require('expect');
const request = require('superagent');
const logger = require('../../../logger/logger');

const { makeGetSingleBuildForBuildMaster } = require('../../use-cases/get-single-build-for-build-master');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const URL = process.env.SPINNAKER_URL;

describe('Integration Test: (Spinnaker service) Get single build for build master use case.', () => {
  let functionalUserIsAvailableOrTesting;
  let getSingleBuildForBuildMaster;
  let buildMaster;
  let buildNumber;
  let jobName;
  before(() => {
    buildMaster = process.env.INTEGRATION_TEST_BUILD_MASTER;
    buildNumber = 1;
    jobName = process.env.INTEGRATION_TEST_TARGET_JOB;
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getSingleBuildForBuildMaster = makeGetSingleBuildForBuildMaster(request, URL, functionalUserIsAvailableOrTesting, logger);
  });
  it('should not be building the job i.e. building state is false.', async () => {
    const result = await getSingleBuildForBuildMaster(buildMaster, buildNumber, jobName);
    expect(result.building).toBeFalsy();
  });
  it('should have a fullDisplayName (format: BuildMaster #BuildNumber).', async () => {
    const result = await getSingleBuildForBuildMaster(buildMaster, buildNumber, jobName);
    expect(result.fullDisplayName).toBe(`${jobName} #${buildNumber}`);
  });
  it('should throw an error if build master does not exist.', async () => {
    await expect(getSingleBuildForBuildMaster('NOT_AN_ACTUAL_BUILD_MASTER', buildNumber, jobName))
      .rejects
      .toEqual(new Error('Unable to GET a single build from build master.'));
  });
  it('should throw an error if build number does not exist.', async () => {
    await expect(getSingleBuildForBuildMaster(buildMaster, -1, jobName))
      .rejects
      .toEqual(new Error('Unable to GET a single build from build master.'));
  });
  it('should throw an error if job does not exist.', async () => {
    await expect(getSingleBuildForBuildMaster(buildMaster, 1, 'NOT_AN_ACTUAL_JOB'))
      .rejects
      .toEqual(new Error('Unable to GET a single build from build master.'));
  });
  it('should not throw an error if build master, build number and job exist.', async () => {
    await expect(getSingleBuildForBuildMaster(buildMaster, buildNumber, jobName))
      .resolves
      .toBeTruthy();
  });
});
