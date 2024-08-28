const expect = require('expect');
const { makeBuildJenkinsJob } = require('../../use-cases/build-jenkins-job');

const logger = require('../../../logger/logger');

describe('Integration Test: (Jenkins service) Build the required jenkins job', () => {
  it('should ensure that we hit the correct "build" function in the jenkins npm package for production code', () => {
    const { NODE_ENV } = process.env;
    const { TB_FUNCTIONAL_USER } = process.env;
    const { TB_FUNCTIONAL_USER_PASSWORD } = process.env;

    process.env.NODE_ENV = 'PROD';
    process.env.TB_FUNCTIONAL_USER = 'dummy_user';
    process.env.TB_FUNCTIONAL_USER_PASSWORD = 'dummy_pass';

    let wasEmitterCalled = false;
    const buildJenkinsJob = makeBuildJenkinsJob(
      {
        job: {
          build: () => {
            wasEmitterCalled = true;
          },
        },
      },
      logger,
    );

    buildJenkinsJob();
    expect(wasEmitterCalled).toBeTruthy();

    process.env.NODE_ENV = NODE_ENV;
    process.env.TB_FUNCTIONAL_USER = TB_FUNCTIONAL_USER;
    process.env.TB_FUNCTIONAL_USER_PASSWORD = TB_FUNCTIONAL_USER_PASSWORD;
  });

  it('should ensure that we do not hit the "build" function in the jenkins npm package for test code', () => {
    let wasEmitterCalled = false;
    const buildJenkinsJob = makeBuildJenkinsJob(
      {
        job: {
          build: () => {
            wasEmitterCalled = true;
          },
        },
      },
      logger,
    );

    buildJenkinsJob();
    expect(wasEmitterCalled).toBeFalsy();
  });
});
