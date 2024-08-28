const expect = require('expect');
const { makeGetJenkinsBuild } = require('../../use-cases/get-jenkins-build');
const { makeFunctionalUserIsAvailableOrTesting } = require('../../use-cases/check-is-functional-user-available-or-testing');

function findChild(parentObject, ...args) {
  return args.reduce((object, property) => object && object[property], parentObject);
}

const fakeJenkinsClient = {
  build: {
    get(options, callback) {
      const jobName = options.name;
      const buildNumber = options.number;
      const jobs = {
        FAKE_JOB: {
          builds: {
            1: {
              result: 'SUCCESS',
            },
            2: {
              result: 'FAILURE',
            },
            3: {
              result: undefined,
            },
          },
        },
      };

      let err;
      if (!findChild(jobs, jobName, 'builds', buildNumber)) err = `Couldn't find build ${buildNumber} for job ${jobName}!`;
      callback(err, jobs[jobName].builds[buildNumber]);
    },
  },
};

describe('Unit Test: (Jenkins service) Get Jenkins Build Use Case', () => {
  let functionalUserIsAvailableOrTesting;
  let getJenkinsBuild;
  before(() => {
    functionalUserIsAvailableOrTesting = makeFunctionalUserIsAvailableOrTesting();
    getJenkinsBuild = makeGetJenkinsBuild(fakeJenkinsClient, functionalUserIsAvailableOrTesting, { info: () => 'Test log', error: () => 'Test error log' });
  });
  it('should return SUCCESS if build specified was successful.', async () => {
    const buildData = await getJenkinsBuild('FAKE_JOB', 1);
    expect(buildData.result).toEqual('SUCCESS');
  });
  it('should return FAILURE if build specified was a failure.', async () => {
    const buildData = await getJenkinsBuild('FAKE_JOB', 2);
    expect(buildData.result).toEqual('FAILURE');
  });
  it('should return undefined if build specified is still ongoing.', async () => {
    const buildData = await getJenkinsBuild('FAKE_JOB', 3);
    expect(buildData.result).toEqual(undefined);
  });
});
