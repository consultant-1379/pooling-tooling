const expect = require('expect');
const { makeCheckIsJenkinsJobOngoing } = require('../../use-cases/check-is-jenkins-job-ongoing');

const logger = require('../../../logger/logger');

describe('Integration Test: (Jenkins service) Check is jenkins job ongoing', () => {
  it('should ensure the function returns false if the object returned has the same build and completed build numbers', async () => {
    const mockObjectReturnedFromJenkins = {
      lastBuild: {
        number: 12,
      },
      lastCompletedBuild: {
        number: 12,
      },
    };
    const checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(
      () => mockObjectReturnedFromJenkins,
      () => true,
      logger,
    );
    const isJenkinsJobOngoing = await checkIsJenkinsJobOngoing('myJenkinsJob');
    expect(isJenkinsJobOngoing).toBeFalsy();
  });

  it('should ensure the function returns true if the object returned has different build and completed build numbers', async () => {
    const mockObjectReturnedFromJenkins = {
      lastBuild: {
        number: 12,
      },
      lastCompletedBuild: {
        number: 13,
      },
    };
    const checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(
      () => mockObjectReturnedFromJenkins,
      () => true,
      logger,
    );
    const isJenkinsJobOngoing = await checkIsJenkinsJobOngoing('myJenkinsJob');
    expect(isJenkinsJobOngoing).toBeTruthy();
  });

  it('should throw an error if false is provided by Jenkins as a build number', async () => {
    const mockObjectReturnedFromJenkins = {
      lastBuild: {
        number: false,
      },
      lastCompletedBuild: {
        number: 13,
      },
    };
    const checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(
      () => mockObjectReturnedFromJenkins,
      () => true,
      logger,
    );
    expect(() => checkIsJenkinsJobOngoing('myJenkinsJob').toThrow());
  });

  it('should do nothing if the function is called for testing purposes', () => {
    let wasFunctionCalled = false;
    const checkIsJenkinsJobOngoing = makeCheckIsJenkinsJobOngoing(
      () => {
        wasFunctionCalled = true;
      },
      () => false,
      logger,
    );

    checkIsJenkinsJobOngoing('myJenkinsJob');
    expect(wasFunctionCalled).toBeFalsy();
  });
});
