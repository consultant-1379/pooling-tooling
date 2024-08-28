function makeCheckIsJenkinsJobOngoing(getJenkinsJob, functionalUserIsAvailableOrTesting, logger) {
  function findChild(parentObject, ...args) {
    return args.reduce((object, property) => object && object[property], parentObject);
  }

  function areDefined(...args) {
    if ([true, ...args].reduce((previous, current) => previous && current)) return true;
    return false;
  }

  return async function checkIsJenkinsJobOngoing(jobName) {
    const loggingTags = {
      service: 'Jenkins (use-cases)',
      action: 'checkIsJenkinsJobOngoing',
      actionParameters: {},
    };

    if (functionalUserIsAvailableOrTesting()) {
      const jobData = await getJenkinsJob(jobName);
      const lastBuildNumber = findChild(jobData, 'lastBuild', 'number');
      const lastCompletedBuildNumber = findChild(jobData, 'lastCompletedBuild', 'number');
      return new Promise((resolve, reject) => {
        if (areDefined(lastBuildNumber, lastCompletedBuildNumber)) {
          if (lastBuildNumber === lastCompletedBuildNumber) resolve(false);
          resolve(true);

          loggingTags.actionParameters = { JobName: jobName, LastBuildNumber: lastBuildNumber, LastCompletedBuildNumber: lastCompletedBuildNumber };
          logger.info(loggingTags, `${jobName} Jenkins job is ongoing.`);
        }
        const errorInfo = {
          message: `Either lastBuildNumber (${lastBuildNumber}) or lastCompletedBuildNumber \
(${lastCompletedBuildNumber}) were undefined. These values are required to check if the Jenkins job (${jobName}) is ongoing.`,
        };
        reject(
          logger.error({ errorInfo, loggingTags }, `Issue in ${loggingTags.service} service. Error thrown by ${loggingTags.action}`),
          new Error(errorInfo.message),
        );
      });
    }
    console.log('DEV: Got jenkins build status: %s', jobName);
  };
}

module.exports = { makeCheckIsJenkinsJobOngoing };
