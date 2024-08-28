function makeGetJenkinsJob(jenkinsClient, functionalUserIsAvailableOrTesting, logger) {
  return function getJenkinsJob(jobName) {
    const loggingTags = {
      service: 'Jenkins (use-cases)',
      action: 'getJenkinsJob',
      actionParameters: { JobName: jobName },
    };
    if (functionalUserIsAvailableOrTesting()) {
      return new Promise((resolve, reject) => {
        jenkinsClient.job.get({
          name: jobName,
        }, (err, jobData) => {
          if (err) {
            reject(err);
          }
          resolve(jobData);
        });
        logger.info(loggingTags, `Retrieving ${jobName} Jenkins job.`);
      });
    }
    console.log('DEV: Got job data: %s', jobName);
  };
}

module.exports = { makeGetJenkinsJob };
