const expect = require('expect');
const { makeCheckIsJenkinsJobOngoing } = require('../../use-cases/check-is-jenkins-job-ongoing');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

function findChild(parentObject, ...args) {
  return args.reduce((object, property) => object && object[property], parentObject);
}

function fakeGetJenkinsJob(jobName) {
  const jobs = {
    FAKE_COMPLETED_JOB: {
      lastBuild: {
        number: 25,
      },
      lastCompletedBuild: {
        number: 25,
      },
    },
    FAKE_ONGOING_JOB: {
      lastBuild: {
        number: 50,
      },
      lastCompletedBuild: {
        number: 49,
      },
    },
  };

  return new Promise((resolve, reject) => {
    if (jobs[jobName]) resolve(jobs[jobName]);
    const lastBuildNumber = findChild(jobs[jobName], 'lastBuild', 'number');
    const lastCompletedBuildNumber = findChild(jobs[jobName], 'lastCompletedBuild', 'number');
    reject(new Error(`TRUNCATED ERR MSG: (${lastBuildNumber})(${lastCompletedBuildNumber})(${jobName}).`));
  });
}

describe('Unit Test: (Jenkins service) Get Jenkins Build Status Use Case', () => {
  let functionalUserIsAvailableOrTesting;
  let checkIsJenkinsJobOngoing;
  before(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(fakeGetJenkinsJob, functionalUserIsAvailableOrTesting, { info: () => 'Test log', error: () => 'Test error log' });
  });
  it('should return false if there is no build ongoing', async () => {
    const isJenkinsJobOngoing = await checkIsJenkinsJobOngoing('FAKE_COMPLETED_JOB');
    expect(isJenkinsJobOngoing).toEqual(false);
  });
  it('should return true if there is a build ongoing', async () => {
    const isJenkinsJobOngoing = await checkIsJenkinsJobOngoing('FAKE_ONGOING_JOB');
    expect(isJenkinsJobOngoing).toEqual(true);
  });
  it('should reject the promise if either build number is undefined.', async () => {
    try {
      await checkIsJenkinsJobOngoing('ANY_NON_EXISTANT_JOB_OR_JOB_MISSING_DATA');
    } catch (error) {
      expect(error).toEqual(new Error('TRUNCATED ERR MSG: (undefined)(undefined)(ANY_NON_EXISTANT_JOB_OR_JOB_MISSING_DATA).'));
    }
  });
});
