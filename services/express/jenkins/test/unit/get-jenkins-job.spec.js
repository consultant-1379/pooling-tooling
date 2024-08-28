const expect = require('expect');
const { makeGetJenkinsJob } = require('../../use-cases/get-jenkins-job');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

const fakeJenkinsClient = {
  job: {
    get(jobName, callback) {
      const jobs = {
        FAKE_JOB: {
          lastBuild: {
            number: 2083,
          },
        },
      };

      let err;
      if (!jobs[jobName.name]) err = 'That job does not exist!';

      callback(err, jobs[jobName.name]);
    },
  },
};

describe('Unit Test: (Jenkins service) Get Jenkins Job Use Case', () => {
  let functionalUserIsAvailableOrTesting;
  let getJenkinsJob;
  before(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getJenkinsJob = makeGetJenkinsJob(fakeJenkinsClient, functionalUserIsAvailableOrTesting, { info: () => 'Test log', error: () => 'Test error log' });
  });
  it('should return object containing job data', async () => {
    const jobData = await getJenkinsJob('FAKE_JOB');
    expect(jobData).toStrictEqual({
      lastBuild: {
        number: 2083,
      },
    });
  });
  it('should reject the promise if the job does not exist', async () => {
    try {
      await getJenkinsJob('NON_EXISTANT_JOB');
    } catch (error) {
      expect(error).toEqual('That job does not exist!');
    }
  });
});
