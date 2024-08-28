function makeGetJenkinsBuild(jenkinsClient, functionalUserIsAvailableOrTesting, logger) {
  return function getJenkinsBuild(jobName, buildNumber) {
    const loggingTags = {
      service: 'Jenkins (use-cases)',
      action: 'getJenkinsBuild',
      actionParameters: { JobName: jobName, BuildNumber: buildNumber },
    };
    if (functionalUserIsAvailableOrTesting()) {
      return new Promise((resolve, reject) => {
        jenkinsClient.build.get({
          name: jobName,
          number: buildNumber,
        }, (err, buildData) => {
          if (err) {
            reject(err);
          }
          resolve(buildData);
        });
        logger.info(loggingTags, `Retrieving build ${buildNumber} for ${jobName} Jenkins job.`);
      });
    }
    console.log('DEV: Got build data: %s', jobName);
  };
}

module.exports = { makeGetJenkinsBuild };
