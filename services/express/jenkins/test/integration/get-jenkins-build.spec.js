const expect = require('expect');
const logger = require('../../../logger/logger');

const { makeGetJenkinsBuild } = require('../../use-cases/get-jenkins-build');

describe('Integration Test: (Jenkins service) Get jenkins build.', () => {
  it('should ensure that we hit the correct "get" function in the jenkins npm package for production code', () => {
    let wasFunctionCalled = false;
    const getJenkinsBuild = makeGetJenkinsBuild(
      {
        build: {
          get: () => {
            wasFunctionCalled = true;
          },
        },
      },
      () => true,
      logger,
    );

    getJenkinsBuild('myJenkinsJob', '13');
    expect(wasFunctionCalled).toBeTruthy();
  });

  it('should ensure that we do not hit the "get" function in the jenkins npm package for non production code', () => {
    let wasFunctionCalled = false;
    const getJenkinsBuild = makeGetJenkinsBuild(
      {
        build: {
          get: () => {
            wasFunctionCalled = true;
          },
        },
      },
      () => false,
      logger,
    );

    getJenkinsBuild('myJenkinsJob', '13');
    expect(wasFunctionCalled).toBeFalsy();
  });
});
