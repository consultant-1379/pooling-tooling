const expect = require('expect');
const logger = require('../../../logger/logger');

const { makeGetJenkinsJob } = require('../../use-cases/get-jenkins-job');

describe('Integration Test: (Jenkins service) Get jenkins job.', () => {
  it('should ensure that we hit the correct "get" function in the jenkins npm package for production code', () => {
    let wasFunctionCalled = false;
    const getJenkinsJob = makeGetJenkinsJob(
      {
        job: {
          get: () => {
            wasFunctionCalled = true;
          },
        },
      },
      () => true,
      logger,
    );

    getJenkinsJob('myJenkinsJob');
    expect(wasFunctionCalled).toBeTruthy();
  });

  it('should ensure that we do not hit the "get" function in the jenkins npm package for non production code', () => {
    let wasFunctionCalled = false;
    const getJenkinsJob = makeGetJenkinsJob(
      {
        job: {
          get: () => {
            wasFunctionCalled = true;
          },
        },
      },
      () => false,
      logger,
    );

    getJenkinsJob('myJenkinsJob');
    expect(wasFunctionCalled).toBeFalsy();
  });
});
